import Image from "next/image";

export function Hero() {
  return (
    <section className="relative paper-grain overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 60% at 88% 0%, rgba(223,118,84,0.20), transparent 60%), radial-gradient(70% 60% at -5% 100%, rgba(47,74,58,0.18), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 sm:pt-14 lg:pt-24 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6 sm:mb-7">
            <span className="h-px w-10 bg-ink/60" />
            <span className="text-[0.65rem] sm:text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
              Play · Connect · Belong
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,11vw,7.5rem)] leading-[0.92] tracking-tight">
            <span className="block">Welcome to</span>
            <span className="block italic text-court">
              The NOOK
              <span className="text-coral">.</span>
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 max-w-xl text-lg sm:text-xl lg:text-2xl leading-[1.4] font-display italic text-ink-soft">
            A place to play, laugh, and feel at home.
          </p>

          <p className="mt-5 sm:mt-6 max-w-xl text-base lg:text-lg leading-[1.7] text-ink-soft">
            The NOOK is more than a pickleball court. It is where good games,
            good people, and a community that feels welcoming all share the
            same space — from the moment you arrive.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#book" className="btn-coral">
              Book the NOOK
              <span aria-hidden>→</span>
            </a>
            <a href="#community" className="btn-ghost">
              Meet the Community
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 shadow-[0_30px_60px_-30px_rgba(32,52,42,0.45),0_12px_24px_-12px_rgba(32,52,42,0.25)]">
              <Image
                src="/photos/18.jpg"
                alt="The NOOK community gathered on court"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-court-deep/70 via-transparent to-transparent"
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 60%, rgba(47,74,58,0.18) 100%)",
                }}
              />
              <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-paper">
                <div className="text-[0.6rem] tracking-[0.32em] uppercase opacity-80">
                  The Regulars
                </div>
                <div className="font-display italic text-xl sm:text-2xl mt-1 leading-snug">
                  Some come to compete. Some come to belong.
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute -top-8 -left-10 rotate-[-6deg]">
              <div className="w-32 h-40 overflow-hidden border border-ink/20 bg-paper shadow-[0_20px_40px_-20px_rgba(32,52,42,0.4)]">
                <Image
                  src="/photos/12.jpg"
                  alt="A player reaching for a high return"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="hidden lg:block absolute -bottom-6 -right-6 bg-coral text-paper px-5 py-4 max-w-[14rem] border border-coral-deep">
              <div className="text-[0.6rem] tracking-[0.32em] uppercase opacity-90">
                What we offer
              </div>
              <div className="font-display italic text-lg leading-snug mt-1">
                A welcome, a paddle, and a spot for you.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manifesto strip — replaces the old marquee */}
      <div className="relative border-y border-ink/15 bg-court text-paper paper-grain overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 80% at 0% 50%, rgba(223,118,84,0.22), transparent 60%), radial-gradient(50% 80% at 100% 50%, rgba(194,205,178,0.14), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-10 lg:py-14">
          <div className="flex items-baseline gap-4 mb-8 lg:mb-10">
            <span className="h-px w-10 bg-coral" />
            <span className="text-[0.65rem] tracking-[0.32em] uppercase text-paper/65">
              The House Rules
            </span>
            <span className="hidden sm:block flex-1 h-px bg-paper/15" />
            <span className="hidden sm:block text-[0.65rem] tracking-[0.32em] uppercase text-paper/45">
              Est. on the kitchen line
            </span>
          </div>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-10 gap-y-9 lg:gap-y-0">
            {[
              {
                tag: "Have fun.",
                note: "Loose grip. Loud laughs. The W is just a bonus.",
              },
              {
                tag: "Respect the game.",
                note: "Honor the line, the partner, and the next match.",
              },
              {
                tag: "Lift each other.",
                note: "Cheer the rally. Share the paddle. Make the call.",
              },
              {
                tag: "Keep coming back.",
                note: "Regulars become friends. Friends become family.",
              },
            ].map((rule, i) => (
              <li
                key={rule.tag}
                className="group lg:border-l lg:border-paper/15 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <div className="flex items-center gap-3">
                  <span className="tabular text-coral text-[0.62rem] tracking-[0.32em]">
                    No. 0{i + 1}
                  </span>
                  <span className="h-px flex-1 bg-paper/15 transition-colors duration-300 group-hover:bg-coral/70" />
                </div>
                <div className="font-display italic text-2xl sm:text-[1.7rem] lg:text-3xl mt-3 leading-[1.1] tracking-[-0.01em]">
                  {rule.tag}
                </div>
                <div className="mt-3 text-[0.78rem] sm:text-sm text-paper/65 leading-[1.65] max-w-[22ch]">
                  {rule.note}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-9 lg:mt-12 flex items-center justify-between gap-4 pt-6 border-t border-paper/15">
            <div className="flex items-center gap-3 text-[0.65rem] tracking-[0.3em] uppercase text-paper/55">
              <span className="text-coral">✦</span>
              <span>All skill levels welcome</span>
              <span className="hidden sm:inline text-paper/30">·</span>
              <span className="hidden sm:inline">Family friendly</span>
            </div>
            <span className="hidden md:inline text-[0.6rem] tracking-[0.3em] uppercase text-paper/40">
              Pinned to the wall, abided by all.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
