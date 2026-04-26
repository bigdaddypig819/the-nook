"use client";

import { useEffect, useRef, useState } from "react";
import { createBooking } from "@/app/actions";
import { saveMyBooking } from "@/lib/local-bookings";
import { formatHourRange, MAX_DURATION } from "@/lib/slots";

type Props = {
  date: string;
  hour: number;
  hourLabel: string;
  dayLabel: string;
  maxDuration: number;
  onClose: () => void;
};

type Stage =
  | { kind: "form" }
  | { kind: "submitting" }
  | { kind: "success"; id: string; token: string }
  | { kind: "error"; message: string };

export function BookingDialog({
  date,
  hour,
  hourLabel,
  dayLabel,
  maxDuration,
  onClose,
}: Props) {
  const [stage, setStage] = useState<Stage>({ kind: "form" });
  const [duration, setDuration] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage({ kind: "submitting" });
    const res = await createBooking({
      date,
      hour,
      durationHours: duration,
      name,
      email,
      phone,
    });
    if (!res.ok) {
      setStage({ kind: "error", message: res.error });
      return;
    }
    saveMyBooking({
      id: res.data.id,
      token: res.data.token,
      date,
      hour,
      duration,
      name,
      savedAt: new Date().toISOString(),
    });
    setStage({ kind: "success", id: res.data.id, token: res.data.token });
  }

  const headerRange =
    duration === 1 ? hourLabel : formatHourRange(hour, duration);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md card-elev border border-ink/20 bg-paper anim-pop">
        {/* Header */}
        <div className="border-b border-ink/15 px-6 lg:px-8 py-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-ink-soft">
              Reserve The Nook
            </div>
            <div
              id="booking-title"
              className="font-display text-2xl mt-1 leading-tight"
            >
              {dayLabel}
              <span className="text-coral"> · </span>
              <span className="tabular">{headerRange}</span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-soft hover:text-ink text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 lg:px-8 py-6">
          {stage.kind === "success" ? (
            <SuccessBody id={stage.id} token={stage.token} onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <DurationPicker
                value={duration}
                onChange={setDuration}
                maxDuration={maxDuration}
              />
              <Field
                label="Name"
                value={name}
                onChange={setName}
                required
                autoComplete="name"
                placeholder="Jane Pickleton"
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                required
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
              />
              <Field
                label="Phone (optional)"
                value={phone}
                onChange={setPhone}
                type="tel"
                autoComplete="tel"
                placeholder="+1 555 0123"
              />

              {stage.kind === "error" && (
                <p
                  role="alert"
                  className="text-sm text-coral-deep border-l-2 border-coral pl-3"
                >
                  {stage.message}
                </p>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[0.72rem] tracking-[0.2em] uppercase text-ink-soft hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stage.kind === "submitting"}
                  className="btn-primary disabled:opacity-60 disabled:cursor-wait"
                >
                  {stage.kind === "submitting" ? "Booking…" : "Confirm Booking"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function DurationPicker({
  value,
  onChange,
  maxDuration,
}: {
  value: number;
  onChange: (n: number) => void;
  maxDuration: number;
}) {
  const options = Array.from({ length: MAX_DURATION }, (_, i) => i + 1);
  return (
    <div>
      <span className="text-[0.65rem] tracking-[0.25em] uppercase text-ink-soft">
        Duration
      </span>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {options.map((n) => {
          const disabled = n > maxDuration;
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => onChange(n)}
              aria-pressed={active}
              className={`px-2 py-2.5 border text-sm tabular transition-colors ${
                active
                  ? "bg-coral text-paper border-coral"
                  : disabled
                    ? "border-ink/10 text-ink-soft/40 cursor-not-allowed"
                    : "border-ink/25 hover:border-ink"
              }`}
            >
              {n} <span className="text-[0.6rem] tracking-[0.18em] uppercase opacity-80">hr</span>
            </button>
          );
        })}
      </div>
      {maxDuration < MAX_DURATION && (
        <p className="mt-2 text-[0.65rem] tracking-[0.05em] text-ink-soft">
          {maxDuration === 0
            ? "No time available at this slot."
            : `Up to ${maxDuration} hour${maxDuration === 1 ? "" : "s"} available before the next booking or closing time.`}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[0.65rem] tracking-[0.25em] uppercase text-ink-soft">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 w-full bg-paper-deep/40 border border-ink/20 px-4 py-3 text-base focus:border-coral focus:bg-paper outline-none transition-colors"
      />
    </label>
  );
}

function SuccessBody({
  id,
  token,
  onClose,
}: {
  id: string;
  token: string;
  onClose: () => void;
}) {
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/b/${id}?t=${token}`
      : `/b/${id}?t=${token}`;
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-coral text-paper flex items-center justify-center font-display text-xl">
          ✓
        </span>
        <div>
          <div className="font-display text-2xl leading-tight">
            You&apos;re on the court.
          </div>
          <div className="text-sm text-ink-soft">
            We saved this booking to your browser.
          </div>
        </div>
      </div>

      <div className="border border-ink/15 bg-paper-deep/40 p-4">
        <div className="text-[0.6rem] tracking-[0.3em] uppercase text-ink-soft mb-2">
          Manage Link · Save This
        </div>
        <div className="flex items-center gap-2">
          <code className="block flex-1 truncate text-xs font-mono bg-paper px-3 py-2 border border-ink/15">
            {link}
          </code>
          <button
            onClick={copy}
            className="btn-ghost !py-2 !px-3 !text-[0.65rem]"
            type="button"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-soft leading-relaxed">
          Use this link to reschedule or cancel later. It&apos;s the only way
          back if you clear your browser.
        </p>
      </div>

      <div className="flex justify-between items-center pt-1">
        <a
          href={link}
          className="text-[0.72rem] tracking-[0.2em] uppercase underline underline-offset-4 text-ink hover:text-coral"
        >
          Open booking →
        </a>
        <button onClick={onClose} className="btn-primary">
          Done
        </button>
      </div>
    </div>
  );
}
