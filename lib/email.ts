import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { format, parse } from "date-fns";
import { formatHourRange } from "./slots";

export type BookingPayload = {
  id: string;
  token: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  hour: number;
  duration: number;
};

let transporter: Transporter | null = null;
let configured: boolean | null = null;

function getTransport(): Transporter | null {
  if (configured === false) return null;
  if (transporter) return transporter;
  const { GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    console.warn(
      "[email] disabled — missing GMAIL_USER / GMAIL_APP_PASSWORD / ADMIN_EMAIL",
    );
    configured = false;
    return null;
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/\s+/g, "") },
  });
  configured = true;
  return transporter;
}

function from(): string {
  return process.env.EMAIL_FROM || (process.env.GMAIL_USER ?? "");
}

function adminTo(): string {
  return process.env.ADMIN_EMAIL ?? "";
}

function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function manageLink(b: BookingPayload): string {
  return `${siteOrigin()}/b/${b.id}?t=${b.token}`;
}

function dayLabel(dateISO: string): string {
  return format(parse(dateISO, "yyyy-MM-dd", new Date()), "EEEE, MMMM d");
}

function rangeLabel(b: BookingPayload | { hour: number; duration: number }): string {
  return formatHourRange(b.hour, b.duration);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlShell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="font-family:Georgia,serif;background:#f3ecde;color:#1c2620;margin:0;padding:32px;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #d6cdb8;padding:32px;">
    <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#3a4a40;">The Nook</div>
    <h1 style="font-family:Georgia,serif;font-size:28px;letter-spacing:-0.02em;margin:8px 0 20px;color:#1c2620;">${escapeHtml(title)}</h1>
    ${bodyHtml}
  </div>
</body></html>`;
}

async function safeSend(
  label: string,
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<void> {
  const t = getTransport();
  if (!t) return;
  if (!to) return;
  try {
    await t.sendMail({ from: from(), to, subject, text, html });
  } catch (err) {
    console.error(`[email:${label}] send failed`, err);
  }
}

export async function sendBookingCreated(b: BookingPayload): Promise<void> {
  const day = dayLabel(b.date);
  const time = rangeLabel(b);
  const link = manageLink(b);
  const subject = `The Nook · Booked ${format(parse(b.date, "yyyy-MM-dd", new Date()), "EEE MMM d")}, ${time}`;

  const playerText = `Hi ${b.name},

You're on the court ${day} from ${time}.

Manage or cancel your booking:
${link}

See you on the court.
— The Nook`;

  const playerHtml = htmlShell(
    "You're on the court.",
    `<p style="font-size:15px;line-height:1.7;">Hi ${escapeHtml(b.name)},</p>
     <p style="font-size:15px;line-height:1.7;">You're on the court <strong>${escapeHtml(day)}</strong> from <strong>${escapeHtml(time)}</strong>.</p>
     <p style="margin-top:24px;"><a href="${link}" style="display:inline-block;background:#1c2620;color:#f3ecde;padding:12px 22px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Manage Booking</a></p>
     <p style="font-size:12px;color:#3a4a40;margin-top:24px;">Save this link — it's the only way back to your booking if you clear your browser.</p>`,
  );

  const adminText = `New booking on The Nook.

${day}, ${time}

Player: ${b.name}
Email:  ${b.email}${b.phone ? `\nPhone:  ${b.phone}` : ""}

Manage link: ${link}`;

  const adminHtml = htmlShell(
    `New booking · ${day}`,
    `<p style="font-size:15px;line-height:1.7;"><strong>${escapeHtml(day)}</strong><br/>${escapeHtml(time)}</p>
     <table style="font-size:14px;border-collapse:collapse;margin-top:8px;">
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Player</td><td style="padding:4px 0;">${escapeHtml(b.name)}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Email</td><td style="padding:4px 0;">${escapeHtml(b.email)}</td></tr>
       ${b.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Phone</td><td style="padding:4px 0;">${escapeHtml(b.phone)}</td></tr>` : ""}
     </table>
     <p style="font-size:12px;margin-top:24px;"><a href="${link}" style="color:#b85a3e;">View booking →</a></p>`,
  );

  await Promise.allSettled([
    safeSend("created:player", b.email, subject, playerText, playerHtml),
    safeSend("created:admin", adminTo(), `[Nook] New: ${day}, ${time}`, adminText, adminHtml),
  ]);
}

export async function sendBookingCancelled(b: BookingPayload): Promise<void> {
  const day = dayLabel(b.date);
  const time = rangeLabel(b);

  const playerText = `Hi ${b.name},

Your court time on ${day} (${time}) has been cancelled.

Want to grab another slot? ${siteOrigin()}

— The Nook`;

  const playerHtml = htmlShell(
    "Booking cancelled.",
    `<p style="font-size:15px;line-height:1.7;">Hi ${escapeHtml(b.name)},</p>
     <p style="font-size:15px;line-height:1.7;">Your court time on <strong>${escapeHtml(day)}</strong> (${escapeHtml(time)}) has been cancelled.</p>
     <p style="margin-top:24px;"><a href="${siteOrigin()}" style="display:inline-block;background:#1c2620;color:#f3ecde;padding:12px 22px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Book another time</a></p>`,
  );

  const adminText = `Booking cancelled.

${day}, ${time}

Player: ${b.name}
Email:  ${b.email}`;

  const adminHtml = htmlShell(
    `Cancelled · ${day}`,
    `<p style="font-size:15px;line-height:1.7;"><strong>${escapeHtml(day)}</strong><br/>${escapeHtml(time)}</p>
     <table style="font-size:14px;border-collapse:collapse;margin-top:8px;">
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Player</td><td style="padding:4px 0;">${escapeHtml(b.name)}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Email</td><td style="padding:4px 0;">${escapeHtml(b.email)}</td></tr>
     </table>`,
  );

  await Promise.allSettled([
    safeSend("cancelled:player", b.email, `The Nook · Cancelled ${day}`, playerText, playerHtml),
    safeSend("cancelled:admin", adminTo(), `[Nook] Cancelled: ${day}, ${time}`, adminText, adminHtml),
  ]);
}

export async function sendBookingRescheduled(
  b: BookingPayload,
  previous: { date: string; hour: number; duration: number },
): Promise<void> {
  const oldDay = dayLabel(previous.date);
  const oldTime = rangeLabel(previous);
  const newDay = dayLabel(b.date);
  const newTime = rangeLabel(b);
  const link = manageLink(b);

  const playerText = `Hi ${b.name},

Your booking has moved.

From: ${oldDay}, ${oldTime}
To:   ${newDay}, ${newTime}

Manage: ${link}

— The Nook`;

  const playerHtml = htmlShell(
    "Your booking moved.",
    `<p style="font-size:15px;line-height:1.7;">Hi ${escapeHtml(b.name)},</p>
     <table style="font-size:14px;border-collapse:collapse;margin-top:8px;">
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">From</td><td style="padding:4px 0;text-decoration:line-through;color:#3a4a40;">${escapeHtml(oldDay)}, ${escapeHtml(oldTime)}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">To</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(newDay)}, ${escapeHtml(newTime)}</td></tr>
     </table>
     <p style="margin-top:24px;"><a href="${link}" style="display:inline-block;background:#1c2620;color:#f3ecde;padding:12px 22px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">Manage Booking</a></p>`,
  );

  const adminText = `Booking rescheduled.

From: ${oldDay}, ${oldTime}
To:   ${newDay}, ${newTime}

Player: ${b.name}
Email:  ${b.email}

Manage link: ${link}`;

  const adminHtml = htmlShell(
    `Rescheduled · ${newDay}`,
    `<table style="font-size:14px;border-collapse:collapse;margin-top:8px;">
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">From</td><td style="padding:4px 0;text-decoration:line-through;color:#3a4a40;">${escapeHtml(oldDay)}, ${escapeHtml(oldTime)}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">To</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(newDay)}, ${escapeHtml(newTime)}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Player</td><td style="padding:4px 0;">${escapeHtml(b.name)}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#3a4a40;">Email</td><td style="padding:4px 0;">${escapeHtml(b.email)}</td></tr>
     </table>
     <p style="font-size:12px;margin-top:24px;"><a href="${link}" style="color:#b85a3e;">View booking →</a></p>`,
  );

  await Promise.allSettled([
    safeSend("rescheduled:player", b.email, `The Nook · Moved to ${newDay}, ${newTime}`, playerText, playerHtml),
    safeSend("rescheduled:admin", adminTo(), `[Nook] Moved: ${newDay}, ${newTime}`, adminText, adminHtml),
  ]);
}
