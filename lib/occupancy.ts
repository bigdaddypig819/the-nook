import type { PublicSlot } from "./bookings";
import { CLOSE_HOUR, MAX_DURATION } from "./slots";

export type OccupancyEntry = {
  id: string;
  isStart: boolean;
  startHour: number;
  durationHours: number;
};

function key(date: string, hour: number): string {
  return `${date}|${hour}`;
}

export function buildOccupancy(slots: PublicSlot[]): Map<string, OccupancyEntry> {
  const map = new Map<string, OccupancyEntry>();
  for (const s of slots) {
    for (let h = s.slot_hour; h < s.slot_hour + s.duration_hours; h++) {
      map.set(key(s.slot_date, h), {
        id: s.id,
        isStart: h === s.slot_hour,
        startHour: s.slot_hour,
        durationHours: s.duration_hours,
      });
    }
  }
  return map;
}

export function getOccupancy(
  occupancy: Map<string, OccupancyEntry>,
  date: string,
  hour: number,
): OccupancyEntry | undefined {
  return occupancy.get(key(date, hour));
}

export function computeMaxDuration(
  date: string,
  hour: number,
  occupancy: Map<string, OccupancyEntry>,
  excludeId?: string,
): number {
  const cap = Math.min(MAX_DURATION, CLOSE_HOUR - hour);
  if (cap <= 0) return 0;
  for (let h = hour + 1; h < hour + cap; h++) {
    const entry = occupancy.get(key(date, h));
    if (entry && entry.id !== excludeId) {
      return h - hour;
    }
  }
  return cap;
}
