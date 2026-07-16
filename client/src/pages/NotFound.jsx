import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-shell flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-sm tracking-widest text-faint">404</div>
      <h1 className="mt-4 text-[36px] font-extrabold tracking-[-0.03em] md:text-[48px]">
        This page isn't on the calendar.
      </h1>
      <p className="mt-4 max-w-105 text-[17px] leading-[1.65] text-muted">
        The link may be old. Head back home or browse what's coming up.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white transition-transform duration-300 ease-smooth hover:-translate-y-0.75 hover:text-white"
        >
          Go home
        </Link>
        <Link
          to="/events"
          className="accent-border hover:accent-tint rounded-btn border px-7 py-4 text-[15px] font-bold text-accent transition-[background,translate] duration-300 ease-smooth hover:-translate-y-0.75"
        >
          See all events
        </Link>
      </div>
    </section>
  );
}
