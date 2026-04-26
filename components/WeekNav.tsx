"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addDays, format } from "date-fns";
import { weekStartFor } from "@/lib/dates";

type Props = {
  weekStartISO: string;
  rangeLabel: string;
};

export function WeekNav({ weekStartISO, rangeLabel }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function goto(deltaDays: number) {
    const start = new Date(`${weekStartISO}T00:00:00`);
    const next = addDays(start, deltaDays);
    const param = format(next, "yyyy-MM-dd");
    startTransition(() => {
      router.push(`/?week=${param}#book`);
    });
  }

  function gotoToday() {
    const start = weekStartFor(new Date());
    const param = format(start, "yyyy-MM-dd");
    startTransition(() => {
      router.push(`/?week=${param}#book`);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
          Schedule
        </div>
        <div className="font-display text-3xl lg:text-4xl mt-1">
          {rangeLabel}
        </div>
      </div>
      <div
        className={`flex items-center border border-ink/30 transition-opacity ${
          pending ? "opacity-60" : "opacity-100"
        }`}
      >
        <button
          onClick={() => goto(-7)}
          className="px-4 h-10 border-r border-ink/30 hover:bg-ink hover:text-paper transition-colors text-sm tracking-wider uppercase"
          aria-label="Previous week"
        >
          ←
        </button>
        <button
          onClick={gotoToday}
          className="px-5 h-10 border-r border-ink/30 hover:bg-ink hover:text-paper transition-colors text-[0.72rem] tracking-[0.18em] uppercase"
        >
          Today
        </button>
        <button
          onClick={() => goto(7)}
          className="px-4 h-10 hover:bg-ink hover:text-paper transition-colors text-sm tracking-wider uppercase"
          aria-label="Next week"
        >
          →
        </button>
      </div>
    </div>
  );
}
