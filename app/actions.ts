"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import {
  COURT,
  fitsBeforeClose,
  isValidDuration,
  isValidSlotHour,
  MAX_DAYS_AHEAD,
} from "@/lib/slots";
import {
  daysFromNow,
  isSlotInPast,
  parseDateISO,
} from "@/lib/dates";
import {
  sendBookingCancelled,
  sendBookingCreated,
  sendBookingRescheduled,
  type BookingPayload,
} from "@/lib/email";

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type CreateInput = {
  date: string;
  hour: number;
  durationHours: number;
  name: string;
  email: string;
  phone?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(input: CreateInput): string | null {
  const { date, hour, durationHours, name, email } = input;
  if (!parseDateISO(date)) return "Invalid date.";
  if (!isValidSlotHour(hour)) return "Invalid time slot.";
  if (!isValidDuration(durationHours)) return "Invalid duration.";
  if (!fitsBeforeClose(hour, durationHours))
    return "That duration runs past closing time.";
  if (isSlotInPast(date, hour)) return "That slot has already passed.";
  if (daysFromNow(date) > MAX_DAYS_AHEAD)
    return `Bookings open up to ${MAX_DAYS_AHEAD} days in advance.`;
  if (!name || name.trim().length < 2) return "Please enter your name.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email.";
  return null;
}

export async function createBooking(
  input: CreateInput,
): Promise<ActionResult<{ id: string; token: string }>> {
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const id = nanoid(12);
  const token = nanoid(24);
  const now = new Date().toISOString();
  const cleanName = input.name.trim();
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanPhone = input.phone?.trim() || null;
  const newEnd = input.hour + input.durationHours;

  const client = await db();
  const tx = await client.transaction("write");
  try {
    const conflict = await tx.execute({
      sql: `SELECT id FROM bookings
            WHERE court = ?
              AND slot_date = ?
              AND cancelled_at IS NULL
              AND slot_hour < ?
              AND slot_hour + duration_hours > ?
            LIMIT 1`,
      args: [COURT, input.date, newEnd, input.hour],
    });
    if (conflict.rows.length > 0) {
      await tx.rollback();
      return {
        ok: false,
        error: "That time overlaps another booking. Please pick another.",
      };
    }
    await tx.execute({
      sql: `INSERT INTO bookings
            (id, court, slot_date, slot_hour, duration_hours, name, email, phone, cancel_token, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        COURT,
        input.date,
        input.hour,
        input.durationHours,
        cleanName,
        cleanEmail,
        cleanPhone,
        token,
        now,
      ],
    });
    await tx.commit();
  } catch (e) {
    try {
      await tx.rollback();
    } catch {
      // already rolled back
    }
    console.error("[createBooking] failed", e);
    return { ok: false, error: "Could not create booking. Please try again." };
  }

  const payload: BookingPayload = {
    id,
    token,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    date: input.date,
    hour: input.hour,
    duration: input.durationHours,
  };
  void sendBookingCreated(payload);

  revalidatePath("/");
  return { ok: true, data: { id, token } };
}

export async function cancelBooking(
  id: string,
  token: string,
): Promise<ActionResult<{ id: string }>> {
  if (!id || !token) return { ok: false, error: "Missing booking details." };
  const client = await db();

  const before = await client.execute({
    sql: `SELECT id, name, email, phone, slot_date, slot_hour, duration_hours, cancel_token, cancelled_at
          FROM bookings
          WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (before.rows.length === 0)
    return { ok: false, error: "Booking not found or already cancelled." };
  const row = before.rows[0] as Record<string, unknown>;
  if (row.cancel_token !== token || row.cancelled_at)
    return { ok: false, error: "Booking not found or already cancelled." };

  const now = new Date().toISOString();
  const res = await client.execute({
    sql: `UPDATE bookings
          SET cancelled_at = ?
          WHERE id = ? AND cancel_token = ? AND cancelled_at IS NULL`,
    args: [now, id, token],
  });
  if (res.rowsAffected === 0)
    return { ok: false, error: "Booking not found or already cancelled." };

  void sendBookingCancelled({
    id,
    token,
    name: String(row.name),
    email: String(row.email),
    phone: (row.phone as string) ?? null,
    date: String(row.slot_date),
    hour: Number(row.slot_hour),
    duration: Number(row.duration_hours ?? 1),
  });

  revalidatePath("/");
  revalidatePath(`/b/${id}`);
  return { ok: true, data: { id } };
}

type RescheduleInput = {
  id: string;
  token: string;
  newDate: string;
  newHour: number;
  newDuration: number;
};

export async function rescheduleBooking(
  input: RescheduleInput,
): Promise<ActionResult<{ id: string }>> {
  const { id, token, newDate, newHour, newDuration } = input;
  if (!id || !token) return { ok: false, error: "Missing booking details." };
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

  const client = await db();

  const before = await client.execute({
    sql: `SELECT id, name, email, phone, slot_date, slot_hour, duration_hours, cancel_token, cancelled_at
          FROM bookings
          WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (before.rows.length === 0)
    return { ok: false, error: "Booking not found or already cancelled." };
  const row = before.rows[0] as Record<string, unknown>;
  if (row.cancel_token !== token || row.cancelled_at)
    return { ok: false, error: "Booking not found or already cancelled." };

  const previous = {
    date: String(row.slot_date),
    hour: Number(row.slot_hour),
    duration: Number(row.duration_hours ?? 1),
  };

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
            WHERE id = ? AND cancel_token = ? AND cancelled_at IS NULL`,
      args: [newDate, newHour, newDuration, id, token],
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
    console.error("[rescheduleBooking] failed", e);
    return { ok: false, error: "Could not reschedule. Please try again." };
  }

  void sendBookingRescheduled(
    {
      id,
      token,
      name: String(row.name),
      email: String(row.email),
      phone: (row.phone as string) ?? null,
      date: newDate,
      hour: newHour,
      duration: newDuration,
    },
    previous,
  );

  revalidatePath("/");
  revalidatePath(`/b/${id}`);
  return { ok: true, data: { id } };
}
