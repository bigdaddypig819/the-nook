"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingDialog } from "./BookingDialog";
import { readMyBookings, type SavedBooking } from "@/lib/local-bookings";

type Props = {
  date: string;
  hour: number;
  hourLabel: string;
  dayLabel: string;
  bookedId: string | null;
  isContinuation: boolean;
  isPast: boolean;
  maxDuration: number;
};

export function SlotCell({
  date,
  hour,
  hourLabel,
  dayLabel,
  bookedId,
  isContinuation,
  isPast,
  maxDuration,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mine, setMine] = useState<SavedBooking | null>(null);

  useEffect(() => {
    function refresh() {
      if (!bookedId) {
        setMine(null);
        return;
      }
      const saved = readMyBookings().find((b) => b.id === bookedId);
      setMine(saved ?? null);
    }
    refresh();
    window.addEventListener("nook:bookings:changed", refresh);
    return () =>
      window.removeEventListener("nook:bookings:changed", refresh);
  }, [bookedId]);

  // Continuation cell — second/third/fourth hour of a multi-hour booking.
  // Render hatching with no inner label so adjacent cells read as one block.
  if (isContinuation) {
    if (mine) {
      return (
        <div
          className="h-16 lg:h-[4.5rem] hatch-court relative"
          aria-hidden
        >
          <div className="absolute inset-0 bg-coral/85" />
        </div>
      );
    }
    return <div className="h-16 lg:h-[4.5rem] hatch-court" aria-hidden />;
  }

  // Past + empty
  if (isPast && !bookedId) {
    return (
      <div
        className="h-16 lg:h-[4.5rem] flex items-center justify-center text-[0.62rem] tracking-[0.18em] uppercase text-ink-soft/40"
        aria-label={`${hourLabel} ${dayLabel} closed`}
      >
        —
      </div>
    );
  }

  // Booked (start cell of the booking)
  if (bookedId) {
    if (mine) {
      return (
        <Link
          href={`/b/${mine.id}?t=${mine.token}`}
          className="block h-16 lg:h-[4.5rem] hatch-court relative group"
          aria-label={`Your booking at ${hourLabel} ${dayLabel}. Manage.`}
        >
          <div className="absolute inset-0 bg-coral/85 group-hover:bg-coral transition-colors flex flex-col items-center justify-center text-paper">
            <span className="text-[0.6rem] tracking-[0.22em] uppercase">
              You
            </span>
            <span className="text-[0.65rem] mt-0.5 tracking-[0.1em]">
              Manage →
            </span>
          </div>
        </Link>
      );
    }
    return (
      <div
        className="h-16 lg:h-[4.5rem] hatch-court flex items-center justify-center"
        aria-label={`${hourLabel} ${dayLabel} booked`}
      >
        <span className="text-[0.62rem] tracking-[0.25em] uppercase text-court-deep bg-paper/90 px-2 py-0.5 border border-court/30">
          Booked
        </span>
      </div>
    );
  }

  // Available
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="slot-empty w-full h-16 lg:h-[4.5rem] text-center text-[0.7rem] tracking-[0.18em] uppercase flex items-center justify-center group relative"
        aria-label={`Book ${hourLabel} on ${dayLabel}`}
      >
        <span className="text-ink-soft/35 group-hover:opacity-0 transition-opacity tabular text-base font-display">
          +
        </span>
        <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-court-deep flex items-center gap-1">
          Book <span aria-hidden>→</span>
        </span>
      </button>
      {open && (
        <BookingDialog
          date={date}
          hour={hour}
          hourLabel={hourLabel}
          dayLabel={dayLabel}
          maxDuration={maxDuration}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
