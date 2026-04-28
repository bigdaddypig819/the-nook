"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import type { Booking, BookingScope, PublicSlot } from "@/lib/bookings";
import { formatHour, formatHourRange } from "@/lib/slots";
import { isSlotInPast } from "@/lib/dates";
import { adminCancelBooking } from "@/app/admin/actions";
import { AdminBookingActions } from "./AdminBookingActions";

type Props = {
  bookings: Booking[];
  bookedSlots: PublicSlot[];
  scope: BookingScope;
};

type RowStatus = "active" | "past" | "cancelled";

function statusOf(b: Booking): RowStatus {
  if (b.cancelled_at) return "cancelled";
  if (isSlotInPast(b.slot_date, b.slot_hour + b.duration_hours)) return "past";
  return "active";
}

function dayLabel(iso: string): { weekday: string; date: string } {
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return {
    weekday: format(d, "EEE"),
    date: format(d, "MMM d"),
  };
}

export function AdminBookingTable({ bookings, bookedSlots, scope }: Props) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<{ id: string; message: string } | null>(null);
  const [, startTransition] = useTransition();

  function handleCancel(b: Booking) {
    if (
      !confirm(
        `Cancel ${b.name}'s booking on ${dayLabel(b.slot_date).date} at ${formatHour(b.slot_hour)}?\n\nThis will email ${b.email}.`,
      )
    )
      return;
    setError(null);
    setPendingId(b.id);
    startTransition(async () => {
      const res = await adminCancelBooking(b.id);
      setPendingId(null);
      if (!res.ok) {
        setError({ id: b.id, message: res.error });
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="border border-ink/15 bg-paper">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/15 bg-paper-deep/30">
            <tr className="text-left text-[0.62rem] tracking-[0.22em] uppercase text-ink-soft">
              <th className="px-5 py-3 font-medium">Player</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">When</th>
              <th className="px-5 py-3 font-medium">Length</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Manage</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const status = statusOf(b);
              const day = dayLabel(b.slot_date);
              const open = openId === b.id;
              const isCancelling = pendingId === b.id;
              const errMsg = error?.id === b.id ? error.message : null;
              const editable = status === "active";
              return (
                <Fragment key={b.id}>
                  <tr
                    className={`border-b border-ink/10 last:border-b-0 align-top ${
                      open ? "bg-paper-deep/20" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-display text-lg leading-tight tracking-[-0.01em]">
                        {b.name}
                      </div>
                      <div className="text-[0.65rem] tracking-[0.15em] uppercase text-ink-soft/70 mt-1 font-mono">
                        {b.id}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[0.82rem]">
                      <a
                        href={`mailto:${b.email}`}
                        className="text-ink hover:text-coral-deep transition-colors break-all"
                      >
                        {b.email}
                      </a>
                      {b.phone && (
                        <div className="text-ink-soft mt-1 tabular">
                          {b.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[0.6rem] tracking-[0.22em] uppercase text-ink-soft">
                        {day.weekday}
                      </div>
                      <div className="font-display text-lg leading-tight tabular">
                        {day.date}
                      </div>
                      <div className="text-[0.78rem] text-ink-soft tabular mt-0.5">
                        {formatHourRange(b.slot_hour, b.duration_hours)}
                      </div>
                    </td>
                    <td className="px-5 py-4 tabular text-sm">
                      {b.duration_hours} hr
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={status} />
                      {status === "cancelled" && b.cancelled_at && (
                        <div className="text-[0.65rem] text-ink-soft mt-1.5 tabular">
                          {format(new Date(b.cancelled_at), "MMM d")}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {editable ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setError(null);
                              setOpenId(open ? null : b.id);
                            }}
                            className={`px-3 py-1.5 border text-[0.7rem] tracking-[0.15em] uppercase transition-colors ${
                              open
                                ? "bg-ink text-paper border-ink"
                                : "border-ink/30 hover:border-ink"
                            }`}
                          >
                            {open ? "Close" : "Reschedule"}
                          </button>
                          <button
                            onClick={() => handleCancel(b)}
                            disabled={isCancelling}
                            className="px-3 py-1.5 border border-ink/30 text-[0.7rem] tracking-[0.15em] uppercase text-coral-deep hover:bg-coral hover:text-paper hover:border-coral transition-colors disabled:opacity-50"
                          >
                            {isCancelling ? "…" : "Cancel"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[0.65rem] tracking-[0.18em] uppercase text-ink-soft/60">
                          Read-only
                        </span>
                      )}
                    </td>
                  </tr>

                  {errMsg && (
                    <tr className="border-b border-ink/10">
                      <td colSpan={6} className="px-5 py-3 bg-coral/5">
                        <p className="text-[0.78rem] text-coral-deep border-l-2 border-coral pl-3">
                          {errMsg}
                        </p>
                      </td>
                    </tr>
                  )}

                  {open && editable && (
                    <tr className="border-b border-ink/10">
                      <td colSpan={6} className="px-5 py-6 bg-paper-deep/30">
                        <AdminBookingActions
                          booking={b}
                          bookedSlots={bookedSlots}
                          onDone={() => {
                            setOpenId(null);
                            router.refresh();
                          }}
                          onError={(message) => setError({ id: b.id, message })}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-ink/10">
        {bookings.map((b) => {
          const status = statusOf(b);
          const day = dayLabel(b.slot_date);
          const open = openId === b.id;
          const isCancelling = pendingId === b.id;
          const errMsg = error?.id === b.id ? error.message : null;
          const editable = status === "active";
          return (
            <div key={b.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-xl tracking-[-0.01em]">
                    {b.name}
                  </div>
                  <div className="text-[0.78rem] text-ink-soft mt-0.5 break-all">
                    {b.email}
                  </div>
                  {b.phone && (
                    <div className="text-[0.78rem] text-ink-soft tabular">
                      {b.phone}
                    </div>
                  )}
                </div>
                <StatusPill status={status} />
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[0.6rem] tracking-[0.22em] uppercase text-ink-soft">
                  {day.weekday}
                </span>
                <span className="font-display text-lg tabular">{day.date}</span>
                <span className="text-[0.78rem] text-ink-soft tabular">
                  · {formatHourRange(b.slot_hour, b.duration_hours)} ·{" "}
                  {b.duration_hours} hr
                </span>
              </div>

              {errMsg && (
                <p className="mt-3 text-[0.78rem] text-coral-deep border-l-2 border-coral pl-3">
                  {errMsg}
                </p>
              )}

              {editable && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setError(null);
                      setOpenId(open ? null : b.id);
                    }}
                    className={`flex-1 px-3 py-2 border text-[0.7rem] tracking-[0.15em] uppercase transition-colors ${
                      open
                        ? "bg-ink text-paper border-ink"
                        : "border-ink/30 hover:border-ink"
                    }`}
                  >
                    {open ? "Close" : "Reschedule"}
                  </button>
                  <button
                    onClick={() => handleCancel(b)}
                    disabled={isCancelling}
                    className="flex-1 px-3 py-2 border border-ink/30 text-[0.7rem] tracking-[0.15em] uppercase text-coral-deep hover:bg-coral hover:text-paper hover:border-coral transition-colors disabled:opacity-50"
                  >
                    {isCancelling ? "Cancelling…" : "Cancel"}
                  </button>
                </div>
              )}

              {open && editable && (
                <div className="mt-5 pt-5 border-t border-ink/10">
                  <AdminBookingActions
                    booking={b}
                    bookedSlots={bookedSlots}
                    onDone={() => {
                      setOpenId(null);
                      router.refresh();
                    }}
                    onError={(message) => setError({ id: b.id, message })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: RowStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-court/40 bg-court/8 text-court-deep text-[0.62rem] tracking-[0.2em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-court" />
        Active
      </span>
    );
  }
  if (status === "past") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 border border-ink/25 text-ink-soft text-[0.62rem] tracking-[0.2em] uppercase">
        Played
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-coral/40 bg-coral/8 text-coral-deep text-[0.62rem] tracking-[0.2em] uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-coral" />
      Cancelled
    </span>
  );
}
