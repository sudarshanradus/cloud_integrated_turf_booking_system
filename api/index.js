import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const SLOT_TIMES = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
];

const DB_DEFAULTS = { slots: [], bookings: [], cancellations: [], admin: { username: "admin", password: "admin123" } };
const SETTINGS_DEFAULTS = { weekdayRate: 1000, weekendRate: 1300, advanceType: "percent", advanceValue: 20 };

async function readDB() {
  const data = await redis.get("db");
  return data || JSON.parse(JSON.stringify(DB_DEFAULTS));
}

async function writeDB(data) {
  await redis.set("db", data);
}

async function readSettings() {
  const data = await redis.get("settings");
  return data || JSON.parse(JSON.stringify(SETTINGS_DEFAULTS));
}

async function writeSettings(data) {
  await redis.set("settings", data);
}

async function getDayRates(dateStr) {
  const day = new Date(dateStr + "T00:00:00").getDay();
  const settings = await readSettings();
  const rate = day === 0 || day === 6 ? settings.weekendRate : settings.weekdayRate;
  let advance;
  if (settings.advanceType === "percent") {
    advance = Math.round(rate * settings.advanceValue / 100);
  } else {
    advance = settings.advanceValue;
  }
  return { rate, advance, balance: rate - advance };
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
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date is required" });
  const db = await readDB();
  const { rate } = await getDayRates(date);
  const daySlots = db.slots.filter((s) => s.date === date);
  const slots = SLOT_TIMES.map((time) => {
    const existing = daySlots.find((s) => s.time === time);
    return { time, rate, booked: existing ? existing.booked : false, blocked: existing ? existing.blocked : false };
  });
  res.json({ slots, date });
});

app.get("/api/pricing", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date is required" });
  const settings = await readSettings();
  const { rate, advance, balance } = await getDayRates(date);
  res.json({ date, totalRate: rate, advance, balance, advanceType: settings.advanceType, advanceValue: settings.advanceValue });
});

app.get("/api/admin/settings", async (req, res) => {
  if (req.query.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  res.json(await readSettings());
});

app.post("/api/admin/settings", async (req, res) => {
  if (req.body.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  const { weekdayRate, weekendRate, advanceType, advanceValue } = req.body;
  if (!weekdayRate || !weekendRate || !advanceType || advanceValue == null) {
    return res.status(400).json({ error: "All settings fields required" });
  }
  await writeSettings({ weekdayRate: Number(weekdayRate), weekendRate: Number(weekendRate), advanceType, advanceValue: Number(advanceValue) });
  res.json({ success: true });
});

app.post("/api/book", async (req, res) => {
  const { date, time, name, whatsapp } = req.body;
  if (!date || !time || !name || !whatsapp) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const db = await readDB();
  const existing = db.slots.find((s) => s.date === date && s.time === time);
  if (existing && (existing.booked || existing.blocked)) {
    return res.status(409).json({ error: "Slot already booked or blocked" });
  }
  const bookingId = uuidv4().slice(0, 8).toUpperCase();
  const { rate, advance, balance } = await getDayRates(date);
  const newSlot = { date, time, booked: true, blocked: false, bookingId, name, whatsapp, totalRate: rate, advancePaid: advance, balanceDue: balance };
  if (existing) {
    Object.assign(existing, newSlot);
  } else {
    db.slots.push(newSlot);
  }
  db.bookings.push({
    id: bookingId, date, time, name, whatsapp, totalRate: rate, advancePaid: advance, balanceDue: balance, createdAt: new Date().toISOString(),
  });
  await writeDB(db);
  res.json({ success: true, bookingId });
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await readDB();
  if (username === db.admin.username && password === db.admin.password) {
    return res.json({ success: true, token: "admin-token-123" });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/admin/bookings", async (req, res) => {
  const { token } = req.query;
  if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  const db = await readDB();
  res.json(db.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post("/api/admin/block", async (req, res) => {
  const { token, date, time } = req.body;
  if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  if (!date || !time) return res.status(400).json({ error: "Date and time required" });
  const db = await readDB();
  const existing = db.slots.find((s) => s.date === date && s.time === time);
  if (existing && existing.booked) return res.status(409).json({ error: "Cannot block a booked slot" });
  if (existing && existing.blocked) return res.status(409).json({ error: "Slot already blocked" });
  if (existing) {
    existing.blocked = true;
  } else {
    db.slots.push({ date, time, booked: false, blocked: true });
  }
  await writeDB(db);
  res.json({ success: true });
});

app.get("/api/admin/slots", async (req, res) => {
  const { token, date } = req.query;
  if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  if (!date) return res.status(400).json({ error: "Date is required" });
  const db = await readDB();
  const daySlots = db.slots.filter((s) => s.date === date);
  const slots = SLOT_TIMES.map((time) => {
    const existing = daySlots.find((s) => s.time === time);
    return { time, booked: existing ? existing.booked : false, blocked: existing ? existing.blocked : false, bookingId: existing ? existing.bookingId : null, name: existing ? existing.name : null, whatsapp: existing ? existing.whatsapp : null };
  });
  res.json({ slots, date });
});

app.post("/api/admin/unblock", async (req, res) => {
  const { token, date, time } = req.body;
  if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  if (!date || !time) return res.status(400).json({ error: "Date and time required" });
  const db = await readDB();
  const existing = db.slots.find((s) => s.date === date && s.time === time);
  if (!existing || !existing.blocked) return res.status(404).json({ error: "Slot is not blocked" });
  existing.blocked = false;
  await writeDB(db);
  res.json({ success: true });
});

app.get("/api/my-bookings", async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: "Phone number required" });
  const db = await readDB();
  const now = new Date();
  const userBookings = db.bookings
    .filter((b) => b.whatsapp === phone)
    .filter((b) => parseSlotDateTime(b.date, b.time) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(userBookings);
});

app.post("/api/cancel", async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) return res.status(400).json({ error: "Booking ID required" });
  const db = await readDB();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  const slot = db.slots.find((s) => s.bookingId === bookingId);
  if (!slot) return res.status(404).json({ error: "Slot not found" });
  const slotStart = parseSlotDateTime(booking.date, booking.time);
  const now = new Date();
  const diffMinutes = (slotStart - now) / (1000 * 60);
  const withinTwoHours = diffMinutes <= 120;
  const refundIssued = !withinTwoHours;
  slot.booked = false;
  slot.blocked = false;
  slot.bookingId = null;
  db.cancellations = db.cancellations || [];
  db.cancellations.push({
    bookingId: booking.id, date: booking.date, time: booking.time, name: booking.name, whatsapp: booking.whatsapp,
    advancePaid: booking.advancePaid, refundIssued, cancelledAt: now.toISOString(), withinTwoHours,
  });
  await writeDB(db);
  res.json({ success: true, refundIssued, advancePaid: booking.advancePaid, withinTwoHours });
});

app.get("/api/admin/cancellations", async (req, res) => {
  if (req.query.token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  const db = await readDB();
  res.json((db.cancellations || []).sort((a, b) => new Date(b.cancelledAt) - new Date(a.cancelledAt)));
});

app.post("/api/admin/refund-override", async (req, res) => {
  const { token, bookingId, refundIssued } = req.body;
  if (token !== "admin-token-123") return res.status(401).json({ error: "Unauthorized" });
  if (!bookingId) return res.status(400).json({ error: "Booking ID required" });
  const db = await readDB();
  const cancellation = (db.cancellations || []).find((c) => c.bookingId === bookingId);
  if (!cancellation) return res.status(404).json({ error: "Cancellation not found" });
  cancellation.refundIssued = refundIssued;
  await writeDB(db);
  res.json({ success: true, refundIssued });
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
