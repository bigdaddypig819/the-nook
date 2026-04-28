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
import { sendBookingCreated, type BookingPayload } from "@/lib/email";
import {
  cancelBookingCore,
  rescheduleBookingCore,
  type ActionResult,
} from "@/lib/booking-mutations";

export type { ActionResult };

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
  revalidatePath("/admin");
  return { ok: true, data: { id, token } };
}

async function verifyToken(id: string, token: string): Promise<boolean> {
  if (!id || !token) return false;
  const client = await db();
  const res = await client.execute({
    sql: `SELECT cancel_token, cancelled_at FROM bookings WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (res.rows.length === 0) return false;
  const row = res.rows[0] as Record<string, unknown>;
  if (row.cancelled_at) return false;
  return row.cancel_token === token;
}

export async function cancelBooking(
  id: string,
  token: string,
): Promise<ActionResult<{ id: string }>> {
  if (!(await verifyToken(id, token)))
    return { ok: false, error: "Booking not found or already cancelled." };
  return cancelBookingCore(id);
}

type RescheduleInput = {
  id: string;
  token: string;
  newDate: string;
  newHour: number;
  newDuration: number;
};

export async function verifyMyBookings(
  items: { id: string; token: string }[],
): Promise<{ validIds: string[] }> {
  if (!items || items.length === 0) return { validIds: [] };
  const ids = items.map((i) => i.id).filter(Boolean);
  if (ids.length === 0) return { validIds: [] };
  const client = await db();
  const placeholders = ids.map(() => "?").join(",");
  const res = await client.execute({
    sql: `SELECT id, cancel_token FROM bookings
          WHERE id IN (${placeholders}) AND cancelled_at IS NULL`,
    args: ids,
  });
  const tokenById = new Map<string, string>();
  for (const row of res.rows as Record<string, unknown>[]) {
    tokenById.set(String(row.id), String(row.cancel_token));
  }
  const validIds = items
    .filter((i) => tokenById.get(i.id) === i.token)
    .map((i) => i.id);
  return { validIds };
}

export async function rescheduleBooking(
  input: RescheduleInput,
): Promise<ActionResult<{ id: string }>> {
  const { id, token, newDate, newHour, newDuration } = input;
  if (!(await verifyToken(id, token)))
    return { ok: false, error: "Booking not found or already cancelled." };
  return rescheduleBookingCore({ id, newDate, newHour, newDuration });
}
