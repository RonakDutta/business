import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../components/icons.jsx";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[14px] font-semibold text-accent">Error 404</p>
      <h1 className="display-page mt-3 max-w-[640px]">This page isn't on the calendar.</h1>
      <p className="lead mt-4 max-w-[460px]">
        The link may be old or mistyped. Head back home, or see what's coming up.
      </p>
      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Link to="/" className="btn btn-primary w-full sm:w-auto">
          Go home
        </Link>
        <Link to="/events" className="btn btn-secondary w-full sm:w-auto">
          See upcoming events
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
