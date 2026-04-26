export const COURT = "the-nook";

export const OPEN_HOUR = 7;
export const CLOSE_HOUR = 16;

export const SLOT_HOURS: number[] = Array.from(
  { length: CLOSE_HOUR - OPEN_HOUR },
  (_, i) => OPEN_HOUR + i,
);

export const MAX_DAYS_AHEAD = 30;
export const MAX_DURATION = 4;

export function formatHour(h: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${period}`;
}

export function formatHourRange(h: number, duration = 1): string {
  return `${formatHour(h)} – ${formatHour(h + duration)}`;
}

export function isValidSlotHour(h: number): boolean {
  return Number.isInteger(h) && h >= OPEN_HOUR && h < CLOSE_HOUR;
}

export function isValidDuration(d: number): boolean {
  return Number.isInteger(d) && d >= 1 && d <= MAX_DURATION;
}

export function fitsBeforeClose(hour: number, duration: number): boolean {
  return hour + duration <= CLOSE_HOUR;
}
