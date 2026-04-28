"use server";

import { redirect } from "next/navigation";
import {
  clearAdminCookie,
  isAdminAuthed,
  setAdminCookie,
  verifyPassword,
} from "@/lib/admin-auth";
import {
  cancelBookingCore,
  rescheduleBookingCore,
  type ActionResult,
} from "@/lib/booking-mutations";

export async function adminLogin(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  if (!verifyPassword(password)) {
    redirect(`/admin/login?error=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }
  await setAdminCookie();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function adminLogout(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

export async function adminCancelBooking(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdminAuthed()))
    return { ok: false, error: "Not authorized." };
  if (!id) return { ok: false, error: "Missing booking id." };
  return cancelBookingCore(id);
}

type AdminRescheduleInput = {
  id: string;
  newDate: string;
  newHour: number;
  newDuration: number;
};

export async function adminRescheduleBooking(
  input: AdminRescheduleInput,
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdminAuthed()))
    return { ok: false, error: "Not authorized." };
  if (!input.id) return { ok: false, error: "Missing booking id." };
  return rescheduleBookingCore(input);
}
