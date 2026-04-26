import { PickleballMark } from "./Nav";

export function CourtInfo() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-16"
    >
      <div className="lg:col-span-5">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
          The Court
        </div>
        <h2 className="font-display text-5xl lg:text-6xl mt-3 leading-[0.95]">
          One court.
          <br />
          <span className="italic text-court">Lots of personality.</span>
        </h2>
        <p className="mt-7 text-lg leading-[1.7] text-ink-soft">
          The Nook sits behind the old hardware store, painted court-green with
          chalky white lines. It&apos;s small, it&apos;s scruffy, and we wouldn&apos;t change a
          thing. Bring a paddle, a friend, and a sense of humor.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-y-6 gap-x-8">
          {[
            ["Hours", "7am – 4pm"],
            ["Slot", "60 minutes"],
            ["Surface", "Asphalt"],
            ["Lights", "Daylight only"],
            ["Price", "Free"],
            ["Cancel by", "1 hour prior"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-ink/15 pt-4">
              <dt className="text-[0.62rem] tracking-[0.25em] uppercase text-ink-soft">
                {k}
              </dt>
              <dd className="font-display text-xl mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lg:col-span-7">
        <div className="relative">
          {/* Decorative card with court diagram */}
          <div className="border border-ink/20 bg-court text-paper p-6 lg:p-10 relative paper-grain overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-coral/30 blur-3xl"
            />
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-paper/60">
                  Diagram · Top View
                </div>
                <div className="font-display text-3xl mt-1">The Nook</div>
              </div>
              <PickleballMark className="w-9 h-9" />
            </div>

            <CourtDiagram />

            <div className="mt-8 grid grid-cols-3 gap-4 text-[0.65rem] tracking-[0.2em] uppercase text-paper/70">
              <div>
                <div className="text-paper">20 ft</div>
                <div>width</div>
              </div>
              <div>
                <div className="text-paper">44 ft</div>
                <div>length</div>
              </div>
              <div>
                <div className="text-paper">7 ft</div>
                <div>kitchen</div>
              </div>
            </div>
          </div>

          {/* Floating quote card */}
          <div className="hidden lg:block absolute -bottom-10 -left-10 max-w-xs bg-coral text-paper p-6 border border-coral-deep">
            <p className="font-display italic text-lg leading-snug">
              “Best little court on the block. The kitchen is sacred.”
            </p>
            <div className="mt-3 text-[0.65rem] tracking-[0.3em] uppercase text-paper/80">
              — A regular
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CourtDiagram() {
  return (
    <svg
      viewBox="0 0 440 200"
      className="w-full h-auto"
      aria-label="Pickleball court diagram"
    >
      {/* Outer court */}
      <rect
        x="10"
        y="10"
        width="420"
        height="180"
        fill="none"
        stroke="rgba(243,236,222,0.85)"
        strokeWidth="2"
      />
      {/* Net */}
      <line
        x1="220"
        y1="10"
        x2="220"
        y2="190"
        stroke="rgba(243,236,222,0.55)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      {/* Kitchen lines */}
      <line
        x1="150"
        y1="10"
        x2="150"
        y2="190"
        stroke="rgba(243,236,222,0.85)"
        strokeWidth="1.4"
      />
      <line
        x1="290"
        y1="10"
        x2="290"
        y2="190"
        stroke="rgba(243,236,222,0.85)"
        strokeWidth="1.4"
      />
      {/* Service lines */}
      <line
        x1="10"
        y1="100"
        x2="150"
        y2="100"
        stroke="rgba(243,236,222,0.85)"
        strokeWidth="1.4"
      />
      <line
        x1="290"
        y1="100"
        x2="430"
        y2="100"
        stroke="rgba(243,236,222,0.85)"
        strokeWidth="1.4"
      />
      {/* Ball */}
      <circle cx="380" cy="60" r="6" fill="var(--coral)" />
      <text
        x="220"
        y="105"
        textAnchor="middle"
        fontSize="9"
        fill="rgba(243,236,222,0.6)"
        letterSpacing="3"
      >
        NET
      </text>
    </svg>
  );
}
