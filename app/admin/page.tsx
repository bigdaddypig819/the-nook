import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getAllBookings, getWeekBookedSlots, type BookingScope } from "@/lib/bookings";
import { todayLocalISO } from "@/lib/dates";
import { format, addDays, parse } from "date-fns";
import { AdminBookingTable } from "@/components/admin/AdminBookingTable";

const SCOPES: { value: BookingScope; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
  { value: "all", label: "All" },
];

function isScope(v: string | undefined): v is BookingScope {
  return v === "upcoming" || v === "past" || v === "cancelled" || v === "all";
}

type SearchParams = Promise<{ scope?: string }>;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const params = await searchParams;
  const scope: BookingScope = isScope(params.scope) ? params.scope : "upcoming";

  const today = todayLocalISO();
  const horizon = format(addDays(parse(today, "yyyy-MM-dd", new Date()), 60), "yyyy-MM-dd");

  const [bookings, bookedSlots] = await Promise.all([
    getAllBookings(scope),
    // Used by the reschedule picker to detect conflicts on other bookings.
    getWeekBookedSlots(today, horizon),
  ]);

  const counts = {
    upcoming: scope === "upcoming" ? bookings.length : null,
  };

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-[0.62rem] tracking-[0.32em] uppercase text-ink-soft">
            Bookings
          </div>
          <h1 className="font-display text-4xl lg:text-5xl mt-1.5">
            The clipboard.
          </h1>
          <p className="text-sm text-ink-soft mt-3 max-w-md leading-relaxed">
            Every reservation in one view. Filter by status, then cancel or move
            anything that needs adjusting.
          </p>
        </div>

        {counts.upcoming !== null && (
          <div className="text-right">
            <div className="font-display text-5xl tabular leading-none">
              {counts.upcoming}
            </div>
            <div className="text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft mt-2">
              Upcoming
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-ink/15 mb-8 flex flex-wrap gap-1 overflow-x-auto">
        {SCOPES.map((s) => {
          const active = s.value === scope;
          return (
            <Link
              key={s.value}
              href={s.value === "upcoming" ? "/admin" : `/admin?scope=${s.value}`}
              className={`relative px-4 py-2.5 text-[0.72rem] tracking-[0.22em] uppercase transition-colors ${
                active
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {s.label}
              {active && (
                <span className="absolute left-3 right-3 -bottom-px h-px bg-coral" />
              )}
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-ink/20 px-6 py-20 text-center">
          <div className="font-display text-2xl">Nothing here.</div>
          <p className="text-sm text-ink-soft mt-2">
            No {scope === "all" ? "" : scope} bookings to show.
          </p>
        </div>
      ) : (
        <AdminBookingTable
          bookings={bookings}
          bookedSlots={bookedSlots}
          scope={scope}
        />
      )}
    </main>
  );
}
