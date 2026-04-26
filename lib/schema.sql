CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  court TEXT NOT NULL DEFAULT 'the-nook',
  slot_date TEXT NOT NULL,
  slot_hour INTEGER NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cancel_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  cancelled_at TEXT
);

-- Overlap enforcement is application-side (transaction in createBooking /
-- rescheduleBooking). This index covers the lookup query.
CREATE INDEX IF NOT EXISTS idx_active_slot_lookup
  ON bookings(court, slot_date, slot_hour, duration_hours)
  WHERE cancelled_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_date
  ON bookings(slot_date)
  WHERE cancelled_at IS NULL;
