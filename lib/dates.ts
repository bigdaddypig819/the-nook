import {
  addDays,
  format,
  isValid,
  parse,
  startOfWeek,
} from "date-fns";

export function todayLocalISO(now: Date = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

export function parseDateISO(s: string): Date | null {
  const d = parse(s, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : null;
}

export function weekStartFor(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function weekDays(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function formatDayLabel(d: Date): string {
  return format(d, "EEE").toUpperCase();
}

export function formatDayNum(d: Date): string {
  return format(d, "d");
}

export function formatMonth(d: Date): string {
  return format(d, "MMMM yyyy");
}

export function formatLong(d: Date): string {
  return format(d, "EEEE, MMMM d, yyyy");
}

export function isSameDay(a: Date, b: Date): boolean {
  return format(a, "yyyy-MM-dd") === format(b, "yyyy-MM-dd");
}

export function isSlotInPast(
  slotDate: string,
  slotHour: number,
  now: Date = new Date(),
): boolean {
  const today = todayLocalISO(now);
  if (slotDate < today) return true;
  if (slotDate > today) return false;
  return slotHour <= now.getHours();
}

export function daysFromNow(slotDate: string, now: Date = new Date()): number {
  const d = parseDateISO(slotDate);
  if (!d) return Infinity;
  const today = parseDateISO(todayLocalISO(now))!;
  const ms = d.getTime() - today.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
