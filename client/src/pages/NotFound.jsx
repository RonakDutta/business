import { Link } from "react-router-dom";
import { ClayCalendar, Sparkle, Squiggle } from "../components/Decor.jsx";

export default function NotFound() {
  return (
    <section className="relative isolate mx-auto flex min-h-[60vh] max-w-shell flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative">
        <div
          aria-hidden
          className="pattern-dots absolute -inset-8 -z-10 rounded-full [mask-image:radial-gradient(closest-side,#000,transparent)]"
        />
        <ClayCalendar className="h-auto w-52 sm:w-60" />
        <Sparkle className="bob absolute -right-3 top-2 h-9 w-9 text-accent [--r:12deg]" />
      </div>

      <div className="mt-6 font-mono text-sm tracking-widest text-faint">404</div>
      <h1 className="mt-3 text-[34px] font-extrabold leading-tight tracking-[-0.03em] md:text-[48px]">
        This page isn't on the calendar.
      </h1>
      <Squiggle className="mt-3 h-3 w-24 text-accent/50" />
      <p className="mt-4 max-w-105 text-[17px] leading-[1.65] text-muted">
        The link may be old. Head back home or browse what's coming up.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="clay clay-press rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white hover:bg-accent hover:text-white"
        >
          Go home
        </Link>
        <Link
          to="/events"
          className="clay clay-press rounded-btn bg-white px-7 py-4 text-[15px] font-bold text-accent"
        >
          See all events
        </Link>
      </div>
    </section>
  );
}
