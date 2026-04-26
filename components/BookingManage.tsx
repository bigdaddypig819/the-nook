"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import { cancelBooking, rescheduleBooking } from "@/app/actions";
import {
  removeMyBooking,
  saveMyBooking,
  updateMyBooking,
} from "@/lib/local-bookings";
import { MAX_DURATION, SLOT_HOURS, formatHour } from "@/lib/slots";
import { isSlotInPast } from "@/lib/dates";
import type { PublicSlot } from "@/lib/bookings";
import { buildOccupancy, computeMaxDuration } from "@/lib/occupancy";

type Props = {
  id: string;
  token: string;
  name: string;
  date: string;
  hour: number;
  duration: number;
  bookedSlots: PublicSlot[];
  rescheduleStartISO: string;
};

export function BookingManage({
  id,
  token,
  name,
  date,
  hour,
  duration,
  bookedSlots,
  rescheduleStartISO,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "reschedule" | "cancelling">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [pickedDate, setPickedDate] = useState<string>(date);
  const [pickedHour, setPickedHour] = useState<number | null>(null);
  const [pickedDuration, setPickedDuration] = useState<number>(1);

  // Persist this booking to localStorage if user is opening via direct link
  useEffect(() => {
    saveMyBooking({
      id,
      token,
      date,
      hour,
      duration,
      name,
      savedAt: new Date().toISOString(),
    });
  }, [id, token, date, hour, duration, name]);

  function handleCancel() {
    if (!confirm("Cancel this booking? This can't be undone.")) return;
    setMode("cancelling");
    setError(null);
    startTransition(async () => {
      const res = await cancelBooking(id, token);
      if (!res.ok) {
        setError(res.error);
        setMode("idle");
        return;
      }
      removeMyBooking(id);
      router.push("/?cancelled=1");
    });
  }

  function handleReschedule() {
    if (pickedHour === null) {
      setError("Pick a new time first.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await rescheduleBooking({
        id,
        token,
        newDate: pickedDate,
        newHour: pickedHour,
        newDuration: pickedDuration,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      updateMyBooking(id, {
        date: pickedDate,
        hour: pickedHour,
        duration: pickedDuration,
      });
      setMode("idle");
      router.refresh();
    });
  }

  // Generate the next 14 days starting from rescheduleStartISO
  const startDay = parse(rescheduleStartISO, "yyyy-MM-dd", new Date());
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(startDay);
    d.setDate(d.getDate() + i);
    return d;
  });

  const occupancy = useMemo(
    () => buildOccupancy(bookedSlots),
    [bookedSlots],
  );

  // Per hour: blocked if any active booking (other than self) covers it.
  function hourBlocked(h: number): boolean {
    const entry = occupancy.get(`${pickedDate}|${h}`);
    return !!entry && entry.id !== id;
  }

  const maxDurationForPicked =
    pickedHour === null
      ? MAX_DURATION
      : computeMaxDuration(pickedDate, pickedHour, occupancy, id);

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-sm text-coral-deep border-l-2 border-coral pl-3">
          {error}
        </p>
      )}

      {mode === "idle" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setMode("reschedule");
              setPickedDate(date);
              setPickedHour(null);
              setPickedDuration(1);
              setError(null);
            }}
            className="btn-primary"
          >
            Reschedule
          </button>
          <button
            onClick={handleCancel}
            className="btn-ghost"
            disabled={pending}
          >
            {pending ? "Cancelling…" : "Cancel Booking"}
          </button>
        </div>
      )}

      {mode === "reschedule" && (
        <div className="border border-ink/20 p-5 lg:p-6 bg-paper-deep/30 space-y-5">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-2xl">Pick a new time</div>
            <button
              onClick={() => setMode("idle")}
              className="text-[0.7rem] tracking-[0.2em] uppercase text-ink-soft hover:text-ink"
            >
              ← Back
            </button>
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
                const isCurrent = pickedDate === date && h === hour;
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
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: MAX_DURATION }, (_, i) => i + 1).map(
                  (n) => {
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
                  },
                )}
              </div>
              {maxDurationForPicked < MAX_DURATION && (
                <p className="mt-2 text-[0.65rem] tracking-[0.05em] text-ink-soft">
                  Up to {maxDurationForPicked} hour
                  {maxDurationForPicked === 1 ? "" : "s"} available before the
                  next booking or closing time.
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleReschedule}
            disabled={pending || pickedHour === null}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Saving…" : "Confirm new time"}
          </button>
        </div>
      )}
    </div>
  );
}
