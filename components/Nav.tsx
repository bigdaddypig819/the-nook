import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-line bg-paper/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <PickleballMark className="w-7 h-7" />
          <span className="font-display text-2xl tracking-tight italic">
            The Nook
          </span>
        </Link>
        <nav className="flex items-center gap-7 text-[0.78rem] uppercase tracking-[0.18em]">
          <a href="#book" className="hover:text-coral transition-colors">
            Book
          </a>
          <a href="#about" className="hover:text-coral transition-colors">
            About
          </a>
          <a
            href="#book"
            className="btn-coral !py-2 !px-4 !text-[0.7rem]"
          >
            Reserve
          </a>
        </nav>
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
