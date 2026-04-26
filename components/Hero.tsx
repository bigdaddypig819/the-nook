import { PickleballMark } from "./Nav";

export function Hero() {
  return (
    <section className="relative paper-grain overflow-hidden">
      {/* Layered radial gradients for atmosphere */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 85% 0%, rgba(223,118,84,0.18), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(47,74,58,0.16), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-14 lg:pt-20 pb-20 lg:pb-28 grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-ink/60" />
            <span className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
              Est. 2026 · One Court · Members Welcome
            </span>
          </div>

          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tight">
            <span className="block">Book the</span>
            <span className="block italic text-court">
              Nook
              <span className="text-coral">.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg lg:text-xl leading-[1.6] text-ink-soft">
            A neighborhood pickleball court tucked between the maples. Reserve a
            one-hour slot — daily, 7&nbsp;am to 4&nbsp;pm. No app, no
            membership. Just paddle.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#book" className="btn-primary">
              See this week
              <span aria-hidden>→</span>
            </a>
            <a href="#about" className="btn-ghost">
              About the court
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-6">
          <div className="frame-marks border border-ink/20 bg-paper/60 p-6 lg:p-7 max-w-xs">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-ink-soft">
                  Today
                </div>
                <div className="font-display text-3xl mt-1 leading-none">
                  <TodayChip />
                </div>
              </div>
              <PickleballMark className="w-9 h-9" />
            </div>
            <div className="text-sm leading-[1.7] text-ink-soft">
              <div className="flex justify-between">
                <span>Hours</span>
                <span className="tabular text-ink">7am – 4pm</span>
              </div>
              <div className="flex justify-between">
                <span>Slot length</span>
                <span className="tabular text-ink">60 min</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="text-ink">Free</span>
              </div>
            </div>
          </div>

          <div className="text-[0.7rem] tracking-[0.25em] uppercase text-ink-soft self-end max-lg:self-start">
            ↓ Pick a time below
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-y border-ink/15 py-3 overflow-hidden bg-court text-paper">
        <div className="flex gap-12 marquee-track whitespace-nowrap text-[0.78rem] tracking-[0.3em] uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 pl-12 shrink-0">
              <span>Single Court</span>
              <span aria-hidden>✦</span>
              <span>Outdoor</span>
              <span aria-hidden>✦</span>
              <span>BYO Paddle</span>
              <span aria-hidden>✦</span>
              <span>Free To Book</span>
              <span aria-hidden>✦</span>
              <span>Cancel Anytime</span>
              <span aria-hidden>✦</span>
              <span>One Court · One Hour · One Game</span>
              <span aria-hidden>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TodayChip() {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = now.getDate();
  return (
    <span>
      <span className="text-coral">{month}</span>{" "}
      <span className="tabular">{day}</span>
    </span>
  );
}
