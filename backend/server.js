import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SLOT_TIMES = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
];

function getDayRates(dateStr) {
  const day = new Date(dateStr + "T00:00:00").getDay();
  const isWeekend = day === 0 || day === 6;
  return { isWeekend };
}

function calcAdvance(rate, advanceType, advanceValue) {
  let advance;
  if (advanceType === "percent") {
    advance = Math.round(rate * Number(advanceValue) / 100);
  } else {
    advance = Number(advanceValue);
  }
  return advance;
}

function parseSlotDateTime(dateStr, timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return new Date(`${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const { rows: daySlots } = await pool.query(
      'SELECT time, is_booked, is_blocked FROM slots WHERE date = $1',
      [date]
    );

    const { isWeekend } = getDayRates(date);
    const result = await pool.query('SELECT value FROM settings WHERE key = $1', [isWeekend ? 'weekendRate' : 'weekdayRate']);
    const rate = Number(result.rows[0]?.value || 1000);

    const slots = SLOT_TIMES.map((time) => {
      const existing = daySlots.find((s) => s.time === time);
      return {
        time,
        rate,
        booked: existing ? existing.is_booked : false,
        blocked: existing ? existing.is_blocked : false,
      };
    });
    res.json({ slots, date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/pricing", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const { isWeekend } = getDayRates(date);
    const rateKey = isWeekend ? 'weekendRate' : 'weekdayRate';
    const { rows: rateRows } = await pool.query('SELECT value FROM settings WHERE key = ANY($1)', [['weekdayRate', 'weekendRate', 'advanceType', 'advanceValue']]);
    const settingsMap = {};
    rateRows.forEach(r => { settingsMap[r.key] = r.value; });

    const rate = Number(settingsMap[rateKey]);
    const advanceType = settingsMap['advanceType'];
    const advanceValue = settingsMap['advanceValue'];
    const advance = calcAdvance(rate, advanceType, advanceValue);

    res.json({
      date,
      totalRate: rate,
      advance,
      balance: rate - advance,
      advanceType,
      advanceValue: Number(advanceValue),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/settings", async (req, res) => {
  try {
    if (req.query.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    const { rows } = await pool.query('SELECT key, value FROM settings');
    const s = {};
    rows.forEach(r => { s[r.key] = r.value; });
    res.json({
      weekdayRate: Number(s.weekdayRate),
      weekendRate: Number(s.weekendRate),
      advanceType: s.advanceType,
      advanceValue: Number(s.advanceValue),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/settings", async (req, res) => {
  try {
    if (req.body.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    const { weekdayRate, weekendRate, advanceType, advanceValue } = req.body;
    if (!weekdayRate || !weekendRate || !advanceType || advanceValue == null) {
      return res.status(400).json({ error: "All settings fields required" });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['weekdayRate', String(weekdayRate)]);
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['weekendRate', String(weekendRate)]);
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['advanceType', advanceType]);
      await client.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['advanceValue', String(advanceValue)]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/book", async (req, res) => {
  try {
    const { date, time, name, whatsapp } = req.body;
    if (!date || !time || !name || !whatsapp) return res.status(400).json({ error: "All fields are required" });

    const { rows: existing } = await pool.query(
      'SELECT is_booked, is_blocked FROM slots WHERE date = $1 AND time = $2',
      [date, time]
    );

    if (existing.length > 0 && (existing[0].is_booked || existing[0].is_blocked)) {
      return res.status(409).json({ error: "Slot already booked or blocked" });
    }

    const { isWeekend } = getDayRates(date);
    const { rows: rateRows } = await pool.query('SELECT key, value FROM settings WHERE key = ANY($1)', [['weekdayRate', 'weekendRate', 'advanceType', 'advanceValue']]);
    const settingsMap = {};
    rateRows.forEach(r => { settingsMap[r.key] = r.value; });

    const rateKey = isWeekend ? 'weekendRate' : 'weekdayRate';
    const rate = Number(settingsMap[rateKey]);
    const advanceType = settingsMap['advanceType'];
    const advanceValue = settingsMap['advanceValue'];
    const advance = calcAdvance(rate, advanceType, advanceValue);
    const balance = rate - advance;

    const bookingId = uuidv4().slice(0, 8).toUpperCase();
    const now = new Date().toISOString();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        'INSERT INTO bookings (id, date, time, name, whatsapp, total_rate, advance_paid, balance_due, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [bookingId, date, time, name, whatsapp, rate, advance, balance, now]
      );

      if (existing.length > 0) {
        await client.query(
          'UPDATE slots SET is_booked = true, is_blocked = false, booking_id = $1 WHERE date = $2 AND time = $3',
          [bookingId, date, time]
        );
      } else {
        await client.query(
          'INSERT INTO slots (date, time, is_booked, is_blocked, booking_id) VALUES ($1, $2, true, false, $3)',
          [date, time, bookingId]
        );
      }

      await client.query('COMMIT');
      res.json({ success: true, bookingId });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query('SELECT password FROM admin WHERE username = $1', [username]);
    if (rows.length > 0 && rows[0].password === password) {
      return res.json({ success: true, token: "admin-token-123" });
    }
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/bookings", async (req, res) => {
  try {
    if (req.query.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    const { rows } = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/block", async (req, res) => {
  try {
    const { token, date, time } = req.body;
    if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    if (!date || !time) return res.status(400).json({ error: "Date and time required" });

    const { rows: existing } = await pool.query(
      'SELECT is_booked, is_blocked FROM slots WHERE date = $1 AND time = $2',
      [date, time]
    );

    if (existing.length > 0) {
      if (existing[0].is_booked) return res.status(409).json({ error: "Cannot block a booked slot" });
      if (existing[0].is_blocked) return res.status(409).json({ error: "Slot already blocked" });
      await pool.query('UPDATE slots SET is_blocked = true WHERE date = $1 AND time = $2', [date, time]);
    } else {
      await pool.query('INSERT INTO slots (date, time, is_booked, is_blocked) VALUES ($1, $2, false, true)', [date, time]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/slots", async (req, res) => {
  try {
    const { token, date } = req.query;
    if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    if (!date) return res.status(400).json({ error: "Date is required" });

    const { rows: daySlots } = await pool.query(
      'SELECT time, is_booked, is_blocked, booking_id, name, whatsapp FROM slots LEFT JOIN bookings ON slots.booking_id = bookings.id WHERE slots.date = $1',
      [date]
    );

    const slots = SLOT_TIMES.map((time) => {
      const existing = daySlots.find((s) => s.time === time);
      return {
        time,
        booked: existing ? existing.is_booked : false,
        blocked: existing ? existing.is_blocked : false,
        bookingId: existing ? existing.booking_id : null,
        name: existing ? existing.name : null,
        whatsapp: existing ? existing.whatsapp : null,
      };
    });
    res.json({ slots, date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/unblock", async (req, res) => {
  try {
    const { token, date, time } = req.body;
    if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    if (!date || !time) return res.status(400).json({ error: "Date and time required" });

    const { rows: existing } = await pool.query(
      'SELECT is_blocked FROM slots WHERE date = $1 AND time = $2',
      [date, time]
    );
    if (existing.length === 0 || !existing[0].is_blocked) {
      return res.status(404).json({ error: "Slot is not blocked" });
    }
    await pool.query('UPDATE slots SET is_blocked = false WHERE date = $1 AND time = $2', [date, time]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/my-bookings", async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    const now = new Date().toISOString();
    const { rows } = await pool.query(
      `SELECT * FROM bookings
       WHERE whatsapp = $1
       AND (date || 'T' || time)::timestamp > $2::timestamp
       ORDER BY date ASC`,
      [phone, now]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/cancel", async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: "Booking ID required" });

    const { rows: booking } = await pool.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
    if (booking.length === 0) return res.status(404).json({ error: "Booking not found" });

    const b = booking[0];
    const slotStart = parseSlotDateTime(b.date, b.time);
    const now = new Date();
    const diffMinutes = (slotStart - now) / (1000 * 60);
    const withinTwoHours = diffMinutes <= 120;
    const refundIssued = !withinTwoHours;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE slots SET is_booked = false, is_blocked = false, booking_id = NULL WHERE booking_id = $1',
        [bookingId]
      );

      await client.query(
        `INSERT INTO cancellations (booking_id, date, time, name, whatsapp, advance_paid, refund_issued, cancelled_at, within_two_hours)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [bookingId, b.date, b.time, b.name, b.whatsapp, b.advance_paid, refundIssued, now.toISOString(), withinTwoHours]
      );

      await client.query('COMMIT');
      res.json({ success: true, refundIssued, advancePaid: b.advance_paid, withinTwoHours });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/cancellations", async (req, res) => {
  try {
    if (req.query.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    const { rows } = await pool.query('SELECT * FROM cancellations ORDER BY cancelled_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/admin/refund-override", async (req, res) => {
  try {
    const { token, bookingId, refundIssued } = req.body;
    if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
    if (!bookingId) return res.status(400).json({ error: "Booking ID required" });

    const { rowCount } = await pool.query(
      'UPDATE cancellations SET refund_issued = $1 WHERE booking_id = $2',
      [refundIssued, bookingId]
    );
    if (rowCount === 0) return res.status(404).json({ error: "Cancellation not found" });
    res.json({ success: true, refundIssued });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function initDB() {
  const sql = `
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(8) PRIMARY KEY,
      date DATE NOT NULL,
      time VARCHAR(10) NOT NULL,
      name VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(20) NOT NULL,
      total_rate INTEGER NOT NULL,
      advance_paid INTEGER NOT NULL,
      balance_due INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS slots (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      time VARCHAR(10) NOT NULL,
      is_booked BOOLEAN DEFAULT FALSE,
      is_blocked BOOLEAN DEFAULT FALSE,
      booking_id VARCHAR(8) REFERENCES bookings(id) ON DELETE SET NULL,
      UNIQUE(date, time)
    );
    CREATE TABLE IF NOT EXISTS admin (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT NOT NULL
    );
    INSERT INTO settings (key, value) VALUES ('weekdayRate', '1000') ON CONFLICT (key) DO NOTHING;
    INSERT INTO settings (key, value) VALUES ('weekendRate', '1300') ON CONFLICT (key) DO NOTHING;
    INSERT INTO settings (key, value) VALUES ('advanceType', 'fixed') ON CONFLICT (key) DO NOTHING;
    INSERT INTO settings (key, value) VALUES ('advanceValue', '500') ON CONFLICT (key) DO NOTHING;
    INSERT INTO admin (username, password) VALUES ('admin', 'admin123') ON CONFLICT (username) DO NOTHING;
    CREATE TABLE IF NOT EXISTS cancellations (
      id SERIAL PRIMARY KEY,
      booking_id VARCHAR(8) REFERENCES bookings(id),
      date DATE NOT NULL,
      time VARCHAR(10) NOT NULL,
      name VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(20) NOT NULL,
      advance_paid INTEGER NOT NULL,
      refund_issued BOOLEAN DEFAULT FALSE,
      cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      within_two_hours BOOLEAN DEFAULT FALSE
    );
  `;
  try {
    await pool.query(sql);
    console.log("Database tables initialized");
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3001;
initDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
});
