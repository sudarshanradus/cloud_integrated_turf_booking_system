import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const dbPath = join(__dirname, "db.json");
  if (!existsSync(dbPath)) {
    console.log("No db.json found. Nothing to migrate.");
    process.exit(0);
  }

  const data = JSON.parse(readFileSync(dbPath, "utf-8"));
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Migrate bookings
    if (data.bookings && data.bookings.length > 0) {
      for (const b of data.bookings) {
        await client.query(
          `INSERT INTO bookings (id, date, time, name, whatsapp, total_rate, advance_paid, balance_due, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [b.id, b.date, b.time, b.name, b.whatsapp, b.totalRate, b.advancePaid, b.balanceDue, b.createdAt]
        );
      }
      console.log(`Migrated ${data.bookings.length} bookings`);
    }

    // Migrate slots
    if (data.slots && data.slots.length > 0) {
      for (const s of data.slots) {
        await client.query(
          `INSERT INTO slots (date, time, is_booked, is_blocked, booking_id)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (date, time) DO UPDATE SET
             is_booked = EXCLUDED.is_booked,
             is_blocked = EXCLUDED.is_blocked,
             booking_id = EXCLUDED.booking_id`,
          [s.date, s.time, s.booked || false, s.blocked || false, s.bookingId || null]
        );
      }
      console.log(`Migrated ${data.slots.length} slots`);
    }

    // Migrate cancellations
    if (data.cancellations && data.cancellations.length > 0) {
      for (const c of data.cancellations) {
        await client.query(
          `INSERT INTO cancellations (booking_id, date, time, name, whatsapp, advance_paid, refund_issued, cancelled_at, within_two_hours)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [c.bookingId, c.date, c.time, c.name, c.whatsapp, c.advancePaid, c.refundIssued, c.cancelledAt, c.withinTwoHours]
        );
      }
      console.log(`Migrated ${data.cancellations.length} cancellations`);
    }

    // Migrate admin
    if (data.admin) {
      await client.query(
        `INSERT INTO admin (username, password) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password = $2`,
        [data.admin.username, data.admin.password]
      );
      console.log("Migrated admin credentials");
    }

    // Migrate settings from settings.json
    const settingsPath = join(__dirname, "settings.json");
    if (existsSync(settingsPath)) {
      const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
      const settingEntries = [
        { key: "weekdayRate", value: String(settings.weekdayRate) },
        { key: "weekendRate", value: String(settings.weekendRate) },
        { key: "advanceType", value: settings.advanceType },
        { key: "advanceValue", value: String(settings.advanceValue) },
      ];
      for (const entry of settingEntries) {
        await client.query(
          `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
          [entry.key, entry.value]
        );
      }
      console.log("Migrated settings");
    }

    await client.query("COMMIT");
    console.log("\nMigration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}
migrate();