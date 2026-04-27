import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <header className="border-b border-line bg-paper/85 backdrop-blur-md sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink overflow-hidden shadow-[0_8px_24px_-12px_rgba(28,38,32,0.45)] ring-1 ring-ink/40 transition-transform duration-200 group-hover:scale-[1.04]">
            <Image
              src="/the-nook-logo.png"
              alt="The NOOK Pickleball logo"
              width={64}
              height={64}
              priority
              className="w-12 h-12 object-cover"
            />
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl tracking-tight italic">
              The NOOK
            </span>
            <span className="block text-[0.6rem] tracking-[0.32em] uppercase text-ink-soft mt-1">
              Play · Connect · Belong
            </span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[0.78rem] uppercase tracking-[0.18em]">
          <a href="#community" className="hover:text-coral transition-colors">
            About
          </a>
          <a href="#everyone" className="hover:text-coral transition-colors">
            For Everyone
          </a>
          <a href="#expect" className="hover:text-coral transition-colors">
            Visit
          </a>
          <a href="#book" className="btn-coral !py-2 !px-4 !text-[0.7rem]">
            Book the NOOK
          </a>
        </nav>
        <a
          href="#book"
          className="md:hidden btn-coral !py-2 !px-3 !text-[0.65rem]"
        >
          Book
        </a>
      </div>
    </header>
  );
}

export function PickleballMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="16" cy="16" r="14" fill="var(--coral)" />
      <g stroke="var(--coral-deep)" strokeWidth="1.4" opacity="0.7">
        <circle cx="11" cy="11" r="1.6" />
        <circle cx="20" cy="9" r="1.6" />
        <circle cx="22" cy="17" r="1.6" />
        <circle cx="14" cy="20" r="1.6" />
        <circle cx="9" cy="19" r="1.6" />
        <circle cx="20" cy="23" r="1.6" />
        <circle cx="13" cy="14" r="1.6" />
      </g>
    </svg>
  );
}
