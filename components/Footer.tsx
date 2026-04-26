import { PickleballMark } from "./Nav";

export function Footer() {
  return (
    <footer className="border-t border-ink/15 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <PickleballMark className="w-7 h-7" />
          <div>
            <div className="font-display text-xl italic">The Nook</div>
            <div className="text-[0.65rem] tracking-[0.25em] uppercase text-ink-soft">
              One court · Open daily 7–4
            </div>
          </div>
        </div>
        <div className="text-[0.7rem] tracking-[0.18em] uppercase text-ink-soft flex flex-wrap gap-x-7 gap-y-2">
          <span>© {new Date().getFullYear()} The Nook</span>
          <a href="#book" className="hover:text-coral">
            Book a Court
          </a>
          <a href="#about" className="hover:text-coral">
            About
          </a>
        </div>
      </div>
    </footer>
  );
}
