import { format } from "date-fns";
import { SLOT_HOURS, formatHour } from "@/lib/slots";
import {
  formatDayLabel,
  formatDayNum,
  isSameDay,
  isSlotInPast,
  weekDays,
} from "@/lib/dates";
import type { PublicSlot } from "@/lib/bookings";
import { buildOccupancy, computeMaxDuration } from "@/lib/occupancy";
import { SlotCell } from "./SlotCell";

type Props = {
  weekStart: Date;
  bookings: PublicSlot[];
};

export function WeekGrid({ weekStart, bookings }: Props) {
  const days = weekDays(weekStart);
  const today = new Date();
  const occupancy = buildOccupancy(bookings);

  return (
    <div className="border border-ink/20 card-elev overflow-hidden">
      {/* Day headers */}
      <div
        className="grid border-b border-ink/15 bg-paper-deep"
        style={{ gridTemplateColumns: "5.5rem repeat(7, 1fr)" }}
      >
        <div className="border-r border-ink/15 p-3 text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft flex items-end justify-end">
          Hour
        </div>
        {days.map((d, idx) => {
          const isToday = isSameDay(d, today);
          return (
            <div
              key={idx}
              className={`p-3 lg:p-4 ${
                idx < 6 ? "border-r border-ink/15" : ""
              } ${isToday ? "bg-moss-soft" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div
                    className={`text-[0.62rem] tracking-[0.22em] uppercase ${
                      isToday ? "text-coral" : "text-ink-soft"
                    }`}
                  >
                    {formatDayLabel(d)}
                  </div>
                  <div className="font-display text-2xl lg:text-3xl tabular leading-none mt-1">
                    {formatDayNum(d)}
                  </div>
                </div>
                {isToday && (
                  <span className="text-[0.55rem] tracking-[0.25em] uppercase text-coral border border-coral px-1.5 py-0.5">
                    Today
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hour rows */}
      {SLOT_HOURS.map((h, hourIdx) => (
        <div
          key={h}
          className={`grid ${
            hourIdx < SLOT_HOURS.length - 1 ? "border-b border-ink/10" : ""
          }`}
          style={{ gridTemplateColumns: "5.5rem repeat(7, 1fr)" }}
        >
          {/* Hour label */}
          <div className="border-r border-ink/15 px-3 py-4 lg:py-5 flex flex-col items-end justify-start">
            <span className="font-display text-xl tabular leading-none">
              {h > 12 ? h - 12 : h}
            </span>
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-ink-soft mt-1">
              {h >= 12 ? "PM" : "AM"}
            </span>
          </div>

          {/* Day cells */}
          {days.map((d, dayIdx) => {
            const dateISO = format(d, "yyyy-MM-dd");
            const entry = occupancy.get(`${dateISO}|${h}`);
            const isPast = isSlotInPast(dateISO, h);
            const isToday = isSameDay(d, today);
            const isContinuation = !!entry && !entry.isStart;
            // For an available cell, compute the longest bookable duration
            const maxDuration = entry
              ? 0
              : computeMaxDuration(dateISO, h, occupancy);
            // Always pass the owning booking id so continuation cells can
            // tint coral when the user owns the booking that spans them.
            const bookedId = entry?.id ?? null;
            // Suppress the bottom border when this cell continues into the next
            // hour as part of the same booking — gives a single visual block.
            const nextEntry = occupancy.get(`${dateISO}|${h + 1}`);
            const mergeWithNext =
              !!entry && !!nextEntry && entry.id === nextEntry.id;

            return (
              <div
                key={dayIdx}
                className={`${
                  dayIdx < 6 ? "border-r border-ink/10" : ""
                } ${isToday ? "bg-moss-soft/40" : ""}`}
                style={mergeWithNext ? { marginBottom: "-1px" } : undefined}
              >
                <SlotCell
                  date={dateISO}
                  hour={h}
                  hourLabel={formatHour(h)}
                  dayLabel={format(d, "EEE, MMM d")}
                  bookedId={bookedId}
                  isContinuation={isContinuation}
                  isPast={isPast}
                  maxDuration={maxDuration}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
