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
              Book a Court
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

      {/* Marquee */}
      <div className="border-y border-ink/15 py-3 overflow-hidden bg-court text-paper">
        <div className="flex gap-12 marquee-track whitespace-nowrap text-[0.78rem] tracking-[0.3em] uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 pl-12 shrink-0">
              <span>Have Fun</span>
              <span aria-hidden>✦</span>
              <span>Respect The Game</span>
              <span aria-hidden>✦</span>
              <span>Support Each Other</span>
              <span aria-hidden>✦</span>
              <span>Keep Coming Back</span>
              <span aria-hidden>✦</span>
              <span>All Skill Levels Welcome</span>
              <span aria-hidden>✦</span>
              <span>Family Friendly</span>
              <span aria-hidden>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
