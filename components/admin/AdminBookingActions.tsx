"use client";

import { useMemo, useState, useTransition } from "react";
import { format, parse, addDays } from "date-fns";
import type { Booking, PublicSlot } from "@/lib/bookings";
import { MAX_DURATION, SLOT_HOURS, formatHour } from "@/lib/slots";
import { isSlotInPast, todayLocalISO } from "@/lib/dates";
import { buildOccupancy, computeMaxDuration } from "@/lib/occupancy";
import { adminRescheduleBooking } from "@/app/admin/actions";

type Props = {
  booking: Booking;
  bookedSlots: PublicSlot[];
  onDone: () => void;
  onError: (message: string) => void;
};

export function AdminBookingActions({
  booking,
  bookedSlots,
  onDone,
  onError,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [pickedDate, setPickedDate] = useState<string>(booking.slot_date);
  const [pickedHour, setPickedHour] = useState<number | null>(null);
  const [pickedDuration, setPickedDuration] = useState<number>(1);

  const startISO = useMemo(() => {
    const today = todayLocalISO();
    return booking.slot_date < today ? today : booking.slot_date;
  }, [booking.slot_date]);

  const days = useMemo(() => {
    const start = parse(startISO, "yyyy-MM-dd", new Date());
    return Array.from({ length: 14 }, (_, i) => addDays(start, i));
  }, [startISO]);

  const occupancy = useMemo(() => buildOccupancy(bookedSlots), [bookedSlots]);

  function hourBlocked(h: number): boolean {
    const entry = occupancy.get(`${pickedDate}|${h}`);
    return !!entry && entry.id !== booking.id;
  }

  const maxDurationForPicked =
    pickedHour === null
      ? MAX_DURATION
      : computeMaxDuration(pickedDate, pickedHour, occupancy, booking.id);

  function handleConfirm() {
    if (pickedHour === null) {
      onError("Pick a new time first.");
      return;
    }
    startTransition(async () => {
      const res = await adminRescheduleBooking({
        id: booking.id,
        newDate: pickedDate,
        newHour: pickedHour,
        newDuration: pickedDuration,
      });
      if (!res.ok) {
        onError(res.error);
        return;
      }
      onDone();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <div className="font-display text-xl tracking-[-0.01em]">
          Move {booking.name}&apos;s booking
        </div>
        <div className="text-[0.62rem] tracking-[0.22em] uppercase text-ink-soft">
          Currently {format(parse(booking.slot_date, "yyyy-MM-dd", new Date()), "EEE MMM d")}
          {" · "}
          {formatHour(booking.slot_hour)}
        </div>
      </div>

      <div>
        <div className="text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft mb-2">
          Day
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const iso = format(d, "yyyy-MM-dd");
            const active = iso === pickedDate;
            return (
              <button
                key={iso}
                onClick={() => {
                  setPickedDate(iso);
                  setPickedHour(null);
                  setPickedDuration(1);
                }}
                className={`shrink-0 px-3 py-2 border transition-colors ${
                  active
                    ? "bg-ink text-paper border-ink"
                    : "border-ink/25 hover:border-ink"
                }`}
              >
                <div className="text-[0.58rem] tracking-[0.22em] uppercase opacity-80">
                  {format(d, "EEE")}
                </div>
                <div className="font-display text-lg tabular leading-none mt-0.5">
                  {format(d, "d")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft mb-2">
          Time
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {SLOT_HOURS.map((h) => {
            const isBooked = hourBlocked(h);
            const isPast = isSlotInPast(pickedDate, h);
            const isCurrent =
              pickedDate === booking.slot_date && h === booking.slot_hour;
            const disabled = (isBooked || isPast) && !isCurrent;
            const active = pickedHour === h;
            return (
              <button
                key={h}
                onClick={() => {
                  setPickedHour(h);
                  setPickedDuration(1);
                }}
                disabled={disabled}
                className={`px-2 py-2.5 border text-sm tabular transition-colors ${
                  active
                    ? "bg-coral text-paper border-coral"
                    : disabled
                      ? "border-ink/10 text-ink-soft/40 cursor-not-allowed"
                      : "border-ink/25 hover:border-ink"
                }`}
              >
                {formatHour(h)}
                {isCurrent && (
                  <span className="block text-[0.55rem] tracking-[0.18em] uppercase opacity-70">
                    current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {pickedHour !== null && (
        <div>
          <div className="text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft mb-2">
            Duration
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-md">
            {Array.from({ length: MAX_DURATION }, (_, i) => i + 1).map((n) => {
              const disabled = n > maxDurationForPicked;
              const active = pickedDuration === n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={disabled}
                  onClick={() => setPickedDuration(n)}
                  aria-pressed={active}
                  className={`px-2 py-2.5 border text-sm tabular transition-colors ${
                    active
                      ? "bg-coral text-paper border-coral"
                      : disabled
                        ? "border-ink/10 text-ink-soft/40 cursor-not-allowed"
                        : "border-ink/25 hover:border-ink"
                  }`}
                >
                  {n}{" "}
                  <span className="text-[0.6rem] tracking-[0.18em] uppercase opacity-80">
                    hr
                  </span>
                </button>
              );
            })}
          </div>
          {maxDurationForPicked < MAX_DURATION && (
            <p className="mt-2 text-[0.65rem] tracking-[0.05em] text-ink-soft">
              Up to {maxDurationForPicked} hour
              {maxDurationForPicked === 1 ? "" : "s"} available before the next
              booking or closing time.
            </p>
          )}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={handleConfirm}
          disabled={pending || pickedHour === null}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Confirm new time"}
        </button>
      </div>
    </div>
  );
}
