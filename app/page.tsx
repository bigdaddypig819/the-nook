import { addDays, format } from "date-fns";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WeekGrid } from "@/components/WeekGrid";
import { WeekNav } from "@/components/WeekNav";
import { MyBookings } from "@/components/MyBookings";
import {
  IntroSection,
  EveryoneSection,
  CommunitySection,
  FamilySection,
  ExpectSection,
  ComePlaySection,
} from "@/components/StorySections";
import { getWeekBookedSlots } from "@/lib/bookings";
import { parseDateISO, weekStartFor } from "@/lib/dates";

type SearchParams = {
  week?: string;
  cancelled?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const requestedWeek = sp.week ? parseDateISO(sp.week) : null;
  const weekStart = weekStartFor(requestedWeek ?? new Date());
  const weekStartISO = format(weekStart, "yyyy-MM-dd");
  const weekEndISO = format(addDays(weekStart, 6), "yyyy-MM-dd");

  let bookings: Awaited<ReturnType<typeof getWeekBookedSlots>> = [];
  let dbError: string | null = null;
  try {
    bookings = await getWeekBookedSlots(weekStartISO, weekEndISO);
  } catch (e) {
    dbError =
      e instanceof Error
        ? e.message
        : "Could not connect to the booking database.";
  }

  const startLabel = format(weekStart, "MMM d");
  const endLabel = format(addDays(weekStart, 6), "MMM d");
  const sameMonth =
    format(weekStart, "MMM") === format(addDays(weekStart, 6), "MMM");
  const rangeLabel = sameMonth
    ? `${startLabel} – ${format(addDays(weekStart, 6), "d")}`
    : `${startLabel} – ${endLabel}`;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <IntroSection />
        <EveryoneSection />
        <CommunitySection />
        <FamilySection />
        <ExpectSection />
        <ComePlaySection />

        <section
          id="book"
          className="mx-auto max-w-7xl px-6 lg:px-10 pt-8 pb-24"
        >
          <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-md">
              <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
                Reserve your time
              </div>
              <h2 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95]">
                Pick your <span className="italic text-court">hour</span>
                <span className="text-coral">.</span>
              </h2>
              <p className="mt-5 text-ink-soft leading-[1.7]">
                Click any open slot to reserve it. Booked slots show as hatched.
                Slots up to 30 days out.
              </p>
            </div>
            {sp.cancelled === "1" && (
              <div className="border border-coral text-coral-deep px-4 py-3 bg-coral/10 text-sm">
                Your booking was cancelled. The slot is open again.
              </div>
            )}
          </div>

          <div className="mb-6">
            <MyBookings />
          </div>

          <div className="mb-5">
            <WeekNav weekStartISO={weekStartISO} rangeLabel={rangeLabel} />
          </div>

          {dbError ? (
            <div className="border border-coral/40 bg-coral/5 p-6 lg:p-8">
              <div className="font-display text-2xl text-coral-deep">
                Database not connected
              </div>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed max-w-2xl">
                The booking calendar needs Turso credentials. Copy{" "}
                <code className="font-mono text-xs">.env.local.example</code> to{" "}
                <code className="font-mono text-xs">.env.local</code>, fill in
                your{" "}
                <code className="font-mono text-xs">TURSO_DATABASE_URL</code>{" "}
                and <code className="font-mono text-xs">TURSO_AUTH_TOKEN</code>,
                then run{" "}
                <code className="font-mono text-xs">npm run db:init</code>.
              </p>
              <p className="mt-3 text-xs text-ink-soft/80 font-mono">
                {dbError}
              </p>
            </div>
          ) : (
            <WeekGrid weekStart={weekStart} bookings={bookings} />
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.7rem] tracking-[0.18em] uppercase text-ink-soft">
            <Legend swatch="bg-paper border border-ink/20" label="Available" />
            <Legend swatch="hatch-court" label="Booked" />
            <Legend swatch="bg-coral" label="Yours" />
            <Legend swatch="bg-moss-soft" label="Today" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-4 h-4 ${swatch}`} />
      <span>{label}</span>
    </div>
  );
}
