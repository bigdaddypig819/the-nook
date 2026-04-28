import "server-only";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  COURT,
  fitsBeforeClose,
  isValidDuration,
  isValidSlotHour,
  MAX_DAYS_AHEAD,
} from "@/lib/slots";
import { daysFromNow, isSlotInPast, parseDateISO } from "@/lib/dates";
import {
  sendBookingCancelled,
  sendBookingRescheduled,
  type BookingPayload,
} from "@/lib/email";

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type ActiveRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  slot_date: string;
  slot_hour: number;
  duration_hours: number;
  cancel_token: string;
};

async function loadActiveBooking(id: string): Promise<ActiveRow | null> {
  const client = await db();
  const res = await client.execute({
    sql: `SELECT id, name, email, phone, slot_date, slot_hour, duration_hours, cancel_token, cancelled_at
          FROM bookings
          WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  const row = res.rows[0] as Record<string, unknown>;
  if (row.cancelled_at) return null;
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: (row.phone as string) ?? null,
    slot_date: String(row.slot_date),
    slot_hour: Number(row.slot_hour),
    duration_hours: Number(row.duration_hours ?? 1),
    cancel_token: String(row.cancel_token),
  };
}

export async function cancelBookingCore(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const row = await loadActiveBooking(id);
  if (!row) return { ok: false, error: "Booking not found or already cancelled." };

  const client = await db();
  const now = new Date().toISOString();
  const res = await client.execute({
    sql: `UPDATE bookings
          SET cancelled_at = ?
          WHERE id = ? AND cancelled_at IS NULL`,
    args: [now, id],
  });
  if (res.rowsAffected === 0)
    return { ok: false, error: "Booking not found or already cancelled." };

  void sendBookingCancelled({
    id,
    token: row.cancel_token,
    name: row.name,
    email: row.email,
    phone: row.phone,
    date: row.slot_date,
    hour: row.slot_hour,
    duration: row.duration_hours,
  });

  revalidatePath("/");
  revalidatePath(`/b/${id}`);
  revalidatePath("/admin");
  return { ok: true, data: { id } };
}

type RescheduleCoreInput = {
  id: string;
  newDate: string;
  newHour: number;
  newDuration: number;
};

export async function rescheduleBookingCore(
  input: RescheduleCoreInput,
): Promise<ActionResult<{ id: string }>> {
  const { id, newDate, newHour, newDuration } = input;

  if (!parseDateISO(newDate)) return { ok: false, error: "Invalid date." };
  if (!isValidSlotHour(newHour))
    return { ok: false, error: "Invalid time slot." };
  if (!isValidDuration(newDuration))
    return { ok: false, error: "Invalid duration." };
  if (!fitsBeforeClose(newHour, newDuration))
    return { ok: false, error: "That duration runs past closing time." };
  if (isSlotInPast(newDate, newHour))
    return { ok: false, error: "That slot has already passed." };
  if (daysFromNow(newDate) > MAX_DAYS_AHEAD)
    return {
      ok: false,
      error: `Bookings open up to ${MAX_DAYS_AHEAD} days in advance.`,
    };

  const row = await loadActiveBooking(id);
  if (!row) return { ok: false, error: "Booking not found or already cancelled." };

  const previous = {
    date: row.slot_date,
    hour: row.slot_hour,
    duration: row.duration_hours,
  };

  const client = await db();
  const newEnd = newHour + newDuration;
  const tx = await client.transaction("write");
  try {
    const conflict = await tx.execute({
      sql: `SELECT id FROM bookings
            WHERE court = ?
              AND slot_date = ?
              AND cancelled_at IS NULL
              AND id != ?
              AND slot_hour < ?
              AND slot_hour + duration_hours > ?
            LIMIT 1`,
      args: [COURT, newDate, id, newEnd, newHour],
    });
    if (conflict.rows.length > 0) {
      await tx.rollback();
      return {
        ok: false,
        error: "That time overlaps another booking. Please pick another.",
      };
    }
    const res = await tx.execute({
      sql: `UPDATE bookings
            SET slot_date = ?, slot_hour = ?, duration_hours = ?
            WHERE id = ? AND cancelled_at IS NULL`,
      args: [newDate, newHour, newDuration, id],
    });
    if (res.rowsAffected === 0) {
      await tx.rollback();
      return { ok: false, error: "Booking not found or already cancelled." };
    }
    await tx.commit();
  } catch (e) {
    try {
      await tx.rollback();
    } catch {
      // already rolled back
    }
    console.error("[rescheduleBookingCore] failed", e);
    return { ok: false, error: "Could not reschedule. Please try again." };
  }

  const payload: BookingPayload = {
    id,
    token: row.cancel_token,
    name: row.name,
    email: row.email,
    phone: row.phone,
    date: newDate,
    hour: newHour,
    duration: newDuration,
  };
  void sendBookingRescheduled(payload, previous);

  revalidatePath("/");
  revalidatePath(`/b/${id}`);
  revalidatePath("/admin");
  return { ok: true, data: { id } };
}
