import { db } from "./db";
import { COURT } from "./slots";

export type Booking = {
  id: string;
  slot_date: string;
  slot_hour: number;
  duration_hours: number;
  name: string;
  email: string;
  phone: string | null;
  cancel_token: string;
  created_at: string;
  cancelled_at: string | null;
};

export type PublicSlot = {
  slot_date: string;
  slot_hour: number;
  duration_hours: number;
  id: string;
};

function rowToBooking(r: Record<string, unknown>): Booking {
  return {
    id: r.id as string,
    slot_date: r.slot_date as string,
    slot_hour: Number(r.slot_hour),
    duration_hours: Number(r.duration_hours ?? 1),
    name: r.name as string,
    email: r.email as string,
    phone: (r.phone as string) ?? null,
    cancel_token: r.cancel_token as string,
    created_at: r.created_at as string,
    cancelled_at: (r.cancelled_at as string) ?? null,
  };
}

export async function getWeekBookedSlots(
  startDate: string,
  endDate: string,
): Promise<PublicSlot[]> {
  const client = await db();
  const res = await client.execute({
    sql: `SELECT id, slot_date, slot_hour, duration_hours
          FROM bookings
          WHERE court = ?
            AND cancelled_at IS NULL
            AND slot_date >= ?
            AND slot_date <= ?`,
    args: [COURT, startDate, endDate],
  });
  return res.rows.map((r) => ({
    id: r.id as string,
    slot_date: r.slot_date as string,
    slot_hour: Number(r.slot_hour),
    duration_hours: Number(r.duration_hours ?? 1),
  }));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const client = await db();
  const res = await client.execute({
    sql: `SELECT * FROM bookings WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  return rowToBooking(res.rows[0] as Record<string, unknown>);
}
