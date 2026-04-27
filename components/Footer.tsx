import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-ink/15 mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-paper/5 overflow-hidden ring-1 ring-paper/15">
                <Image
                  src="/the-nook-logo.png"
                  alt="The NOOK Pickleball logo"
                  width={64}
                  height={64}
                  className="w-14 h-14 object-cover"
                />
              </span>
              <div>
                <div className="font-display text-2xl italic">The NOOK</div>
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-paper/60">
                  Play · Connect · Belong
                </div>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-paper/75 leading-[1.7]">
              A welcoming pickleball community. Come ready to play, learn, and
              enjoy yourself.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[0.62rem] tracking-[0.3em] uppercase text-paper/50">
              Visit
            </div>
            <ul className="mt-4 space-y-2.5 text-paper/85">
              <li>
                <a
                  href="#community"
                  className="hover:text-coral transition-colors"
                >
                  About The NOOK
                </a>
              </li>
              <li>
                <a
                  href="#everyone"
                  className="hover:text-coral transition-colors"
                >
                  For Everyone
                </a>
              </li>
              <li>
                <a href="#expect" className="hover:text-coral transition-colors">
                  What to Expect
                </a>
              </li>
              <li>
                <a href="#book" className="hover:text-coral transition-colors">
                  Book the NOOK
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-[0.62rem] tracking-[0.3em] uppercase text-paper/50">
              The promise
            </div>
            <ul className="mt-4 space-y-2.5 text-paper/85">
              <li className="flex items-baseline gap-3">
                <span className="text-coral text-xs">✦</span>
                <span>Have fun.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-coral text-xs">✦</span>
                <span>Respect the game.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-coral text-xs">✦</span>
                <span>Support each other.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="text-coral text-xs">✦</span>
                <span>Keep coming back.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-paper/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-[0.7rem] tracking-[0.2em] uppercase text-paper/55">
          <span>© {new Date().getFullYear()} The NOOK Pickleball</span>
          <span>Welcome home.</span>
        </div>
      </div>
    </footer>
  );
}
