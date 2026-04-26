"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { readMyBookings, type SavedBooking } from "@/lib/local-bookings";
import { formatHourRange } from "@/lib/slots";

export function MyBookings() {
  const [items, setItems] = useState<SavedBooking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function refresh() {
      const all = readMyBookings();
      const today = format(new Date(), "yyyy-MM-dd");
      const upcoming = all
        .filter((b) => b.date >= today)
        .sort((a, b) =>
          a.date === b.date ? a.hour - b.hour : a.date < b.date ? -1 : 1,
        );
      setItems(upcoming);
      setHydrated(true);
    }
    refresh();
    window.addEventListener("nook:bookings:changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("nook:bookings:changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-ink/25 p-7 text-center">
        <div className="text-[0.65rem] tracking-[0.3em] uppercase text-ink-soft">
          Your Reservations
        </div>
        <p className="font-display text-xl mt-2 text-ink-soft">
          No bookings yet — pick a slot below.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[0.65rem] tracking-[0.3em] uppercase text-ink-soft">
            Your Reservations
          </div>
          <div className="font-display text-2xl mt-1">
            {items.length} upcoming
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((b) => {
          const date = parse(b.date, "yyyy-MM-dd", new Date());
          return (
            <Link
              key={b.id}
              href={`/b/${b.id}?t=${b.token}`}
              className="group border border-ink/20 p-4 bg-paper hover:bg-moss-soft transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft">
                    {format(date, "EEE")}
                  </div>
                  <div className="font-display text-2xl leading-none mt-1">
                    {format(date, "MMM d")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[0.6rem] tracking-[0.22em] uppercase text-ink-soft">
                    Court Time
                  </div>
                  <div className="tabular font-display text-xl mt-0.5 whitespace-nowrap">
                    {formatHourRange(b.hour, b.duration)}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-ink/10 text-[0.7rem] tracking-[0.2em] uppercase text-ink-soft group-hover:text-coral flex justify-between items-center">
                <span>Manage</span>
                <span aria-hidden>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
