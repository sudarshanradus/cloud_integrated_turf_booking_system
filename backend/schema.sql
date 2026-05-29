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
