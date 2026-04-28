import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import { adminLogout } from "./actions";

export const metadata = {
  title: "Admin · The Nook",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthed();

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {authed && (
        <header className="border-b border-ink/15 bg-paper-deep/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
            <Link href="/admin" className="flex items-baseline gap-3 group">
              <span className="font-display text-xl tracking-[-0.02em]">
                The Nook
              </span>
              <span className="text-[0.62rem] tracking-[0.32em] uppercase text-ink-soft group-hover:text-ink transition-colors">
                Admin
              </span>
            </Link>

            <nav className="flex items-center gap-5 text-[0.7rem] tracking-[0.18em] uppercase">
              <Link
                href="/"
                className="text-ink-soft hover:text-ink transition-colors"
              >
                ← Public site
              </Link>
              <form action={adminLogout}>
                <button
                  type="submit"
                  className="text-ink-soft hover:text-coral-deep transition-colors"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>
      )}

      <div className="flex-1">{children}</div>
    </div>
  );
}
