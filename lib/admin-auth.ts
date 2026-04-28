import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "nook_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getEnv(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return null;
  return { password, secret };
}

function computeSessionToken(password: string, secret: string): string {
  return createHmac("sha256", secret).update(password).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function verifyPassword(input: string): boolean {
  const env = getEnv();
  if (!env) return false;
  if (typeof input !== "string" || input.length === 0) return false;
  return constantTimeEqual(input, env.password);
}

export function isValidSessionValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const env = getEnv();
  if (!env) return false;
  const expected = computeSessionToken(env.password, env.secret);
  return constantTimeEqual(value, expected);
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const c = store.get(ADMIN_COOKIE);
  return isValidSessionValue(c?.value);
}

export async function setAdminCookie(): Promise<void> {
  const env = getEnv();
  if (!env) throw new Error("Admin auth not configured");
  const value = computeSessionToken(env.password, env.secret);
  const store = await cookies();
  store.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
