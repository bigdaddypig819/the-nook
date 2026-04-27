import Image from "next/image";

export function IntroSection() {
  return (
    <section
      id="community"
      className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 lg:pt-28 pb-12 lg:pb-16"
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
            More than a court
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95]">
            A place where
            <br />
            <span className="italic text-court">people belong</span>
            <span className="text-coral">.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-6 text-base sm:text-lg leading-[1.7] text-ink-soft max-w-2xl">
          <p>
            The NOOK is more than a pickleball court. It is a place where
            people come to play good games, meet good people, and enjoy being
            part of a community that feels welcoming from the moment you
            arrive.
          </p>
          <ul className="border-t border-ink/15 pt-6 space-y-3 text-ink">
            <li className="flex gap-4">
              <span className="font-display text-coral text-2xl leading-none mt-1">
                ✦
              </span>
              <span>Some people come here to compete.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-coral text-2xl leading-none mt-1">
                ✦
              </span>
              <span>Some come to stay active.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-display text-coral text-2xl leading-none mt-1">
                ✦
              </span>
              <span>
                Some come because they just want a fun place to spend time
                with friends and family.
              </span>
            </li>
          </ul>
          <p className="font-display italic text-xl sm:text-2xl text-ink leading-snug pt-4">
            Whatever brings you in, we want you to feel like you belong here.
          </p>
        </div>
      </div>
    </section>
  );
}

export function EveryoneSection() {
  return (
    <section id="everyone" className="relative paper-grain">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 0% 50%, rgba(194,205,178,0.35), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-6 order-2 lg:order-1">
            {/* Mobile: 2-column simple grid. Desktop: 6-col mosaic */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 lg:[grid-auto-rows:8rem]">
              <ImageTile
                src="/photos/10.jpg"
                alt="Player setting up a strong backhand"
                className="aspect-[3/4] lg:aspect-auto col-span-2 lg:col-span-4 lg:row-span-3"
              />
              <ImageTile
                src="/photos/8.jpg"
                alt="Doubles partners on the move"
                className="aspect-square lg:aspect-auto lg:col-span-2 lg:row-span-2"
              />
              <ImageTile
                src="/photos/1.jpg"
                alt="Players ready at the kitchen line"
                className="aspect-square lg:aspect-auto lg:col-span-2 lg:row-span-2"
                tinted
              />
              <ImageTile
                src="/photos/6.jpg"
                alt="Player lunging for a low return"
                className="aspect-[4/3] lg:aspect-auto lg:col-span-3 lg:row-span-2"
              />
              <ImageTile
                src="/photos/23.jpg"
                alt="Doubles partners squaring up at the net"
                className="aspect-[4/3] lg:aspect-auto lg:col-span-3 lg:row-span-2"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
              Pickleball for Everyone
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95]">
              You don&apos;t have to be
              <br />
              <span className="italic text-court">an expert</span> to play here.
            </h2>
            <div className="mt-8 space-y-5 text-base sm:text-lg leading-[1.7] text-ink-soft max-w-xl">
              <p>
                If you are new to pickleball, we will help you get comfortable.
                If you already play, you will find people who are ready for a
                good match. If you are somewhere in the middle, that is
                perfectly fine too.
              </p>
              <p>
                The best part about pickleball is that almost anyone can enjoy
                it. It is easy to learn, fun to play, and a great way to meet
                people without feeling too much pressure.
              </p>
            </div>

            <div className="mt-10 border-t border-ink/15 pt-7">
              <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft mb-5">
                The goal is simple
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  "Have fun.",
                  "Respect the game.",
                  "Support each other.",
                  "Keep coming back.",
                ].map((line, i) => (
                  <li key={line} className="flex items-baseline gap-3">
                    <span className="tabular text-[0.7rem] text-coral tracking-[0.2em]">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl lg:text-[1.7rem] leading-tight">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CommunitySection() {
  return (
    <section className="bg-court text-paper relative paper-grain overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 100% 0%, rgba(223,118,84,0.30), transparent 60%), radial-gradient(60% 60% at 0% 100%, rgba(194,205,178,0.18), transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-paper/70">
              A Real Community
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl mt-3 leading-[0.92]">
              Not just a court.
              <br />
              <span className="italic text-coral">The people.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="font-display italic text-xl sm:text-2xl leading-[1.4] text-paper/85">
              What makes The NOOK special is the laughter after a missed shot.
              The cheering during a close rally. The way new players slowly
              become regulars — and regulars start to feel like family.
            </p>
          </div>
        </div>

        <div className="mt-12 lg:mt-14 grid grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-5">
          <ImageTile
            src="/photos/3.jpg"
            alt="The NOOK community gathered around the net"
            className="col-span-2 lg:col-span-8 aspect-[4/3] lg:aspect-[16/9]"
            dark
          />
          <ImageTile
            src="/photos/7.jpg"
            alt="Friendly rally during a doubles match"
            className="col-span-2 lg:col-span-4 aspect-[4/3] lg:aspect-auto"
            dark
          />
          <ImageTile
            src="/photos/25.jpg"
            alt="The crew gathered around the table after a long night of pickleball"
            className="col-span-2 lg:col-span-8 aspect-[4/3] lg:aspect-[16/9]"
            dark
            caption="After the last rally"
          />
          <ImageTile
            src="/photos/26.jpg"
            alt="Members night — the whole NOOK family on court"
            className="col-span-2 lg:col-span-4 aspect-[4/3] lg:aspect-auto"
            dark
            objectPosition="object-top"
          />
          <ImageTile
            src="/photos/13.jpg"
            alt="Players sharing a moment after a point"
            className="col-span-1 lg:col-span-4 aspect-square"
            dark
          />
          <ImageTile
            src="/photos/4.jpg"
            alt="Mid-game energy on the court"
            className="col-span-1 lg:col-span-4 aspect-square"
            dark
          />
          <ImageTile
            src="/photos/15.jpg"
            alt="A senior player chasing down a return"
            className="col-span-2 lg:col-span-4 aspect-[4/3] lg:aspect-square"
            dark
          />
        </div>

        <div className="mt-14 lg:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-6 lg:col-start-7 space-y-5 text-base sm:text-lg leading-[1.7] text-paper/85">
            <p>
              We want The NOOK to be a space where people feel comfortable
              showing up, joining a game, and being themselves.
            </p>
            <p className="font-display italic text-2xl sm:text-3xl text-paper leading-snug">
              No pressure. No intimidation.
            </p>
            <p>
              We know it can feel a little awkward walking into a new place,
              especially if you do not know anyone yet. That is why we try to
              keep things easy and welcoming.
            </p>
            <ul className="border-t border-paper/20 pt-6 space-y-3 text-paper">
              <li className="flex gap-4">
                <span className="text-coral text-xl leading-none mt-1">→</span>
                <span>You do not need to bring a full group.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-coral text-xl leading-none mt-1">→</span>
                <span>You do not need to be highly skilled.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-coral text-xl leading-none mt-1">→</span>
                <span>You do not need to worry about fitting in.</span>
              </li>
            </ul>
            <p className="text-paper">
              Just come ready to play, learn, and enjoy yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FamilySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 shadow-[0_30px_60px_-30px_rgba(32,52,42,0.4)]">
              <Image
                src="/photos/22.jpg"
                alt="Players ready for the next point at The NOOK"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-court-deep/40 to-transparent"
              />
            </div>
            <div className="hidden lg:block absolute -bottom-6 -right-6 w-44 aspect-[3/4] overflow-hidden border border-ink/20 bg-paper shadow-[0_20px_40px_-20px_rgba(32,52,42,0.4)]">
              <Image
                src="/photos/24.jpg"
                alt="A NOOK regular ready at the net"
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-10">
          <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
            Family Friendly
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95]">
            A place for
            <br />
            <span className="italic text-court">all ages</span>
            <span className="text-coral">.</span>
          </h2>
          <div className="mt-8 space-y-5 text-base sm:text-lg leading-[1.7] text-ink-soft max-w-xl">
            <p>
              We love seeing parents play with their kids, friends bringing new
              people along, and families spending time together around the
              court.
            </p>
            <p>
              Pickleball has a way of bringing people together, and that is
              something we want to protect.
            </p>
            <p className="font-display italic text-xl sm:text-2xl text-ink leading-snug pt-2">
              Win or lose, we care about good sportsmanship, respect, and
              making sure everyone feels safe and welcome.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExpectSection() {
  const expectations = [
    "People to say hello.",
    "Fun rallies and good energy.",
    "A mix of learning, laughing, and friendly competition.",
    "To leave feeling glad you came.",
  ];
  return (
    <section
      id="expect"
      className="relative paper-grain bg-paper-deep border-y border-ink/10"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, rgba(223,118,84,0.10), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
              What you can expect
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95]">
              A relaxed,
              <br />
              <span className="italic text-court">friendly</span> atmosphere.
            </h2>
            <p className="mt-8 text-base sm:text-lg leading-[1.7] text-ink-soft max-w-md">
              Not just playing pickleball, but enjoying the people you play it
              with. That is really what The NOOK is about.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ol className="divide-y divide-ink/15 border-t border-b border-ink/15">
              {expectations.map((line, i) => (
                <li
                  key={line}
                  className="py-6 lg:py-7 grid grid-cols-[auto_1fr] gap-4 lg:gap-6 items-baseline"
                >
                  <span className="tabular text-coral text-[0.7rem] tracking-[0.25em]">
                    0{i + 1}
                  </span>
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl leading-snug">
                    {line}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ComePlaySection() {
  return (
    <section className="relative paper-grain overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(70% 70% at 50% 100%, rgba(47,74,58,0.12), transparent 60%), radial-gradient(50% 50% at 100% 0%, rgba(223,118,84,0.18), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-20 sm:py-24 lg:py-32 text-center">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-ink-soft">
          Come play with us
        </div>
        <h2 className="font-display text-[clamp(2.25rem,8vw,6.5rem)] mt-4 leading-[0.95] tracking-tight max-w-4xl mx-auto">
          There is a spot for you
          <br />
          <span className="italic text-court">at The NOOK</span>
          <span className="text-coral">.</span>
        </h2>

        <div className="mt-8 sm:mt-10 max-w-xl mx-auto space-y-1 font-display italic text-xl sm:text-2xl lg:text-3xl text-ink-soft leading-[1.4]">
          <p>Bring a friend.</p>
          <p>Bring your family.</p>
          <p>Or just bring yourself.</p>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4">
          <a href="#book" className="btn-coral">
            Book the NOOK
            <span aria-hidden>→</span>
          </a>
          <a href="#community" className="btn-ghost">
            Join the Community
          </a>
        </div>
      </div>
    </section>
  );
}

function ImageTile({
  src,
  alt,
  className = "",
  tinted = false,
  dark = false,
  caption,
  objectPosition = "object-center",
}: {
  src: string;
  alt: string;
  className?: string;
  tinted?: boolean;
  dark?: boolean;
  caption?: string;
  objectPosition?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border ${
        dark ? "border-paper/15" : "border-ink/15"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover ${objectPosition} transition-transform duration-700 ease-out hover:scale-[1.04]`}
      />
      <div
        aria-hidden
        className={`absolute inset-0 ${
          dark
            ? "bg-gradient-to-t from-court-deep/65 via-court-deep/10 to-transparent"
            : "bg-gradient-to-t from-ink/30 via-transparent to-transparent"
        }`}
      />
      {tinted && (
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-multiply"
          style={{ background: "rgba(47,74,58,0.18)" }}
        />
      )}
      {caption && (
        <div className="absolute left-4 bottom-4 right-4 text-paper">
          <div className="text-[0.6rem] tracking-[0.32em] uppercase text-paper/75">
            <span className="text-coral">✦</span> {caption}
          </div>
        </div>
      )}
    </div>
  );
}
