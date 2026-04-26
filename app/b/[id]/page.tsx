import Link from "next/link";
import { addDays, format, parse } from "date-fns";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BookingManage } from "@/components/BookingManage";
import { getBookingById, getWeekBookedSlots } from "@/lib/bookings";
import { formatHourRange } from "@/lib/slots";
import { todayLocalISO } from "@/lib/dates";

type SearchParams = { t?: string };

export default async function BookingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { t: token } = await searchParams;

  const booking = await getBookingById(id);

  if (!booking || !token || booking.cancel_token !== token) {
    return (
      <>
        <Nav />
        <main className="flex-1 mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
            404 · Wrong Link
          </div>
          <h1 className="font-display text-6xl mt-3">Can&apos;t find that one.</h1>
          <p className="mt-5 text-ink-soft">
            That booking doesn&apos;t exist, the link is wrong, or it&apos;s already
            been cancelled.
          </p>
          <Link href="/" className="btn-primary mt-8">
            Back to The Nook
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Cancelled
  if (booking.cancelled_at) {
    return (
      <>
        <Nav />
        <main className="flex-1 mx-auto max-w-3xl px-6 py-24">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
            Cancelled
          </div>
          <h1 className="font-display text-5xl mt-3">
            This booking is <span className="italic text-coral">no longer</span>{" "}
            on the books.
          </h1>
          <p className="mt-5 text-ink-soft">
            Cancelled on{" "}
            {format(new Date(booking.cancelled_at), "MMM d, yyyy 'at' h:mm a")}.
          </p>
          <Link href="/#book" className="btn-primary mt-8">
            Book another time
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const slotDate = parse(booking.slot_date, "yyyy-MM-dd", new Date());

  // Fetch 14 days of booked slots (for reschedule picker)
  const today = todayLocalISO();
  const start = today < booking.slot_date ? today : booking.slot_date;
  const startD = parse(start, "yyyy-MM-dd", new Date());
  const endISO = format(addDays(startD, 30), "yyyy-MM-dd");
  const otherBookings = await getWeekBookedSlots(start, endISO);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 lg:px-10 pt-14 pb-20">
          <Link
            href="/"
            className="text-[0.7rem] tracking-[0.25em] uppercase text-ink-soft hover:text-coral"
          >
            ← Back to schedule
          </Link>

          <div className="mt-6 border border-ink/20 card-elev bg-paper">
            {/* Top header */}
            <div className="grid lg:grid-cols-2 border-b border-ink/15">
              <div className="p-7 lg:p-10 border-b lg:border-b-0 lg:border-r border-ink/15">
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-ink-soft">
                  Your Reservation
                </div>
                <div className="mt-3 font-display text-5xl lg:text-6xl leading-[0.95]">
                  {format(slotDate, "EEEE")}
                </div>
                <div className="font-display text-3xl italic text-court mt-1">
                  {format(slotDate, "MMMM d")}
                </div>
                <div className="mt-6 inline-flex items-baseline gap-3">
                  <span className="text-[0.65rem] tracking-[0.3em] uppercase text-ink-soft">
                    Court Time
                  </span>
                  <span className="font-display text-2xl tabular">
                    {formatHourRange(booking.slot_hour, booking.duration_hours)}
                  </span>
                </div>
              </div>
              <div className="p-7 lg:p-10 bg-court text-paper relative paper-grain">
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-coral/30 blur-3xl"
                />
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-paper/60">
                  Player
                </div>
                <div className="font-display text-3xl mt-2">{booking.name}</div>
                <div className="text-sm text-paper/80 mt-1">
                  {booking.email}
                </div>
                {booking.phone && (
                  <div className="text-sm text-paper/80">{booking.phone}</div>
                )}
                <div className="mt-7 text-[0.6rem] tracking-[0.25em] uppercase text-paper/60">
                  Booked
                </div>
                <div className="text-sm text-paper/85 tabular">
                  {format(
                    new Date(booking.created_at),
                    "MMM d, yyyy · h:mm a",
                  )}
                </div>
              </div>
            </div>

            {/* Manage actions */}
            <div className="p-7 lg:p-10">
              <BookingManage
                id={booking.id}
                token={token}
                name={booking.name}
                date={booking.slot_date}
                hour={booking.slot_hour}
                duration={booking.duration_hours}
                bookedSlots={otherBookings}
                rescheduleStartISO={start}
              />
            </div>
          </div>

          <p className="mt-6 text-xs text-ink-soft text-center max-w-md mx-auto leading-relaxed">
            Bookmark this page — it&apos;s the only way to manage this
            reservation if you switch devices or clear your browser.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
