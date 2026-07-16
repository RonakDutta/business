import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BackLink from "./BackLink.jsx";
import AvatarStack from "./AvatarStack.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import { CheckIcon } from "./icons.jsx";

/* ===========================================================================
   Shared shell for Login and Signup.

   Was a form floating in the middle of an empty page, which made signing up
   feel like paperwork. It's a split panel now: the form on the left, and on
   the right the reason you're filling it in — the room you're joining, drawn
   from the real event data rather than written as marketing copy.

   The right panel is display-only and hidden under lg, so the form is the
   whole page on a phone.
   =========================================================================== */

/* Local to this file — the only place in the app that needs an eye. */
function EyeIcon({ off = false, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3.2" />
      {off && <path d="M4 20L20 4" />}
    </svg>
  );
}

const PERKS = [
  "RSVP in one tap, and keep your seat",
  "Save the editions you want to come to",
  "Your photos from past meetups, in one place",
];

export default function AuthForm({ mode = "login", onSubmit }) {
  const isSignup = mode === "signup";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { upcomingEvents, pastEvents } = useEvents();

  const next = params.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const nextEvent = upcomingEvents.find((e) => !e.cancelled);
  const totalAttendees = useMemo(
    () => pastEvents.reduce((n, e) => n + e.attendeeCount, 0),
    [pastEvents],
  );

  /* Coming from an RSVP? Say so — otherwise the redirect back looks random. */
  const returning = next.startsWith("/events/");

  const submit = () => {
    if (isSignup && !name.trim()) return setError("Tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email doesn't look right.");
    if (password.length < 6)
      return setError("Password needs to be at least 6 characters.");

    setError("");
    onSubmit({ name: name.trim(), email: email.trim() });
    navigate(next, { replace: true });
  };

  const field =
    "w-full rounded-2xl border border-line-strong bg-[#fafbfc] px-4 py-3.5 text-[15px] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.8)] transition-[border-color,background,box-shadow] duration-200 placeholder:text-faint focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--b4-accent)_10%,transparent)] focus:outline-none";
  const labelCls =
    "text-[11.5px] font-bold uppercase tracking-[0.07em] text-subtle";

  return (
    <section className="mx-auto max-w-shell px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14">
      <BackLink to="/">Back home</BackLink>

      <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_30px_70px_-50px_rgba(15,23,42,.6)] lg:grid-cols-[1fr_420px]">
        {/* ---- Form ------------------------------------------------- */}
        <div className="bg-gradient-to-b from-white to-[#fafbfc] p-6 sm:p-9 md:p-12">
          <div className="mx-auto max-w-[380px]">
            {returning && (
              <div className="accent-tint accent-border mb-6 rounded-2xl border px-4 py-3 text-[13px] font-semibold leading-relaxed text-accent">
                Sign in to finish your RSVP — we'll take you straight back to
                it.
              </div>
            )}

            <h1 className="text-[30px] font-extrabold tracking-[-0.035em] md:text-[36px]">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
              {isSignup
                ? "Takes a minute. You'll need one to RSVP for a meetup."
                : "Sign in to RSVP and keep track of the meetups you're attending."}
            </p>

            <form
              className="mt-8 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              {isSignup && (
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>Your name</span>
                  <input
                    className={field}
                    autoComplete="name"
                    placeholder="What should we call you?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              )}

              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>Email</span>
                <input
                  className={field}
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="flex items-baseline justify-between">
                  <span className={labelCls}>Password</span>
                  {!isSignup && (
                    <Link
                      to="/contact"
                      className="text-[12px] font-bold text-subtle transition-colors duration-200 hover:text-accent"
                    >
                      Forgotten?
                    </Link>
                  )}
                </span>

                <span className="relative block">
                  <input
                    className={`${field} pr-12`}
                    type={show ? "text" : "password"}
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    placeholder={
                      isSignup ? "At least 6 characters" : "Your password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-faint transition-colors duration-200 hover:bg-line hover:text-ink"
                  >
                    <EyeIcon off={show} className="h-[18px] w-[18px]" />
                  </button>
                </span>
              </label>

              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white shadow-[0_12px_20px_-14px_rgba(15,23,42,.6)] transition-[translate,background,box-shadow] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_16px_24px_-16px_var(--b4-accent)]"
              >
                {isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
              {isSignup ? "Already a member? " : "New here? "}
              <Link
                to={`${isSignup ? "/login" : "/signup"}${
                  next !== "/" ? `?next=${encodeURIComponent(next)}` : ""
                }`}
                className="font-bold text-accent"
              >
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </div>

        {/* ---- The room you're joining ------------------------------ */}
        <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative">
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
                {pastEvents.length || "190"}
              </span>
              <span className="text-[13px] font-bold uppercase tracking-[0.09em] text-white/45">
                editions
              </span>
            </div>
            <p className="mt-3 max-w-[280px] text-[15px] leading-relaxed text-white/60">
              Marketers, founders and freelancers, every second Saturday at
              Shaheedi Park. Same room, same time, for years.
            </p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span className="text-[14px] leading-snug text-white/75">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Live from the data, not a testimonial someone wrote. */}
          {nextEvent && (
            <div className="relative mt-10 rounded-card border border-white/10 bg-white/[0.06] p-5">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-white/40">
                Next meetup
              </div>
              <div className="mt-2 text-[15px] font-bold leading-snug text-white">
                {nextEvent.when.headline}
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <AvatarStack
                  people={nextEvent.attendees}
                  total={nextEvent.attendeeCount}
                  max={4}
                  size={26}
                  className="[&_span]:ring-ink"
                />
                <span className="text-[12.5px] font-semibold text-white/55">
                  {nextEvent.attendeeCount} going ·{" "}
                  {totalAttendees.toLocaleString("en-IN")} have come through
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
