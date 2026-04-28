import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { adminLogin } from "../actions";

type SearchParams = Promise<{ error?: string; next?: string }>;

export const metadata = {
  title: "Admin · The Nook",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";

  if (await isAdminAuthed()) {
    redirect(next.startsWith("/admin") ? next : "/admin");
  }

  const hasError = params.error === "1";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 paper-grain">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-[0.62rem] tracking-[0.32em] uppercase text-ink-soft">
            The Nook
          </div>
          <h1 className="font-display text-4xl mt-2">Admin</h1>
          <div className="mt-3 mx-auto w-12 h-px bg-ink/30" />
        </div>

        <form
          action={adminLogin}
          className="card-elev frame-marks p-8 space-y-5"
        >
          <input type="hidden" name="next" value={next} />

          <div>
            <label
              htmlFor="password"
              className="block text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              autoComplete="current-password"
              className="w-full bg-paper-deep/40 border border-ink/25 px-3 py-2.5 font-mono text-sm tracking-wide focus:outline-none focus:border-ink"
            />
          </div>

          {hasError && (
            <p className="text-[0.78rem] text-coral-deep border-l-2 border-coral pl-3 leading-relaxed">
              That password didn&apos;t match. Try again.
            </p>
          )}

          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <p className="text-center text-[0.65rem] tracking-[0.18em] uppercase text-ink-soft/70 mt-6">
          Authorized staff only
        </p>
      </div>
    </main>
  );
}
