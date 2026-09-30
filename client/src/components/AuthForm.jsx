import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BackLink from "./BackLink.jsx";
import AvatarStack from "./AvatarStack.jsx";
import Spinner from "./Spinner.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { CalendarIcon, CheckIcon } from "./icons.jsx";

/* ===========================================================================
   Shared shell for Login and Signup.

   The form on the left and, on wide screens, a photo of the room with what
   an account is for and the next meetup on the right. On a phone the form is
   the whole page and the same points sit in a short list underneath it.
   =========================================================================== */

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
  "RSVP in one tap and keep your seat",
  "Save the editions you want to come to",
  "See the photos from every past meetup",
];

export default function AuthForm({ mode = "login", onSubmit }) {
  const isSignup = mode === "signup";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { upcomingEvents, pastEvents } = useEvents();

  useReveal([mode]);

  const next = params.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nextEvent = upcomingEvents.find((e) => !e.cancelled);
  const totalAttendees = useMemo(
    () => pastEvents.reduce((n, e) => n + e.attendeeCount, 0),
    [pastEvents],
  );

  // Coming from an RSVP? Say so, otherwise the redirect back looks random.
  const returning = next.startsWith("/events/");

  const submit = async () => {
    if (submitting) return;
    if (isSignup && !name.trim()) return setError("Please tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email doesn't look right.");
    if (password.length < 6) return setError("Password needs to be at least 6 characters.");

    setError("");
    setSubmitting(true);
    try {
      // Only navigate once sign-in succeeds, so a failed attempt stays put.
      await onSubmit({ name: name.trim(), email: email.trim(), password });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const switchTo = `${isSignup ? "/login" : "/signup"}${
    next !== "/" ? `?next=${encodeURIComponent(next)}` : ""
  }`;

  return (
    <section className="bg-surface">
      <div className="shell py-8 md:py-12">
        <BackLink to="/">Back to home</BackLink>

        <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-panel border border-line bg-white shadow-card lg:grid-cols-[1fr_460px]">
          <div className="px-6 py-10 sm:px-10 md:py-14">
            <div className="mx-auto max-w-[400px]">
              {returning && (
                <div className="mb-7 flex items-start gap-2.5 rounded-card border border-line bg-surface px-4 py-3 text-[14px] leading-relaxed text-ink">
                  <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Sign in to finish your RSVP. We'll take you straight back to it.
                </div>
              )}

              <h1 className="reveal font-display text-[30px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p data-delay="0.05" className="reveal mt-2.5 text-[15.5px] leading-relaxed text-muted">
                {isSignup
                  ? "It takes a minute, and you need one to RSVP for a meetup."
                  : "Sign in to RSVP and keep track of the meetups you're attending."}
              </p>

              <form
                className="mt-8 flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                {isSignup && (
                  <label className="flex flex-col gap-1.5">
                    <span className="field-label">Your name</span>
                    <input
                      className="field"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                )}

                <label className="flex flex-col gap-1.5">
                  <span className="field-label">Email</span>
                  <input
                    className="field"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="flex items-baseline justify-between">
                    <span className="field-label">Password</span>
                    {!isSignup && (
                      <Link
                        to="/contact"
                        className="text-[13px] font-semibold text-subtle transition-colors duration-200 hover:text-accent"
                      >
                        Forgot it?
                      </Link>
                    )}
                  </span>

                  <span className="relative block">
                    <input
                      className="field pr-12"
                      type={show ? "text" : "password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      placeholder={isSignup ? "At least 6 characters" : "Your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="icon-btn absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 text-faint"
                    >
                      <EyeIcon off={show} className="h-[18px] w-[18px]" />
                    </button>
                  </span>
                </label>

                {error && (
                  <p role="alert" className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={submitting} className="btn btn-primary btn-lg mt-1 w-full">
                  {submitting && <Spinner className="h-4 w-4" />}
                  {submitting
                    ? isSignup
                      ? "Creating account…"
                      : "Signing in…"
                    : isSignup
                      ? "Create account"
                      : "Sign in"}
                </button>
              </form>

              <p className="mt-8 border-t border-line pt-6 text-[14.5px] text-muted">
                {isSignup ? "Already a member? " : "New here? "}
                <Link to={switchTo} className="link">
                  {isSignup ? "Sign in" : "Create an account"}
                </Link>
              </p>
            </div>
          </div>

          <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-end">
            <img
              src="/images/hero/hero2.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[50%_45%] opacity-50"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/20" />

            <div className="relative p-10">
              <p className="font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] text-white">
                Marketers, founders and freelancers, every second Saturday.
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] text-white/80">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                    {p}
                  </li>
                ))}
              </ul>

              {nextEvent && (
                <div className="mt-8 rounded-card border border-white/15 bg-white/5 p-5">
                  <p className="text-[13px] font-semibold text-white/60">Next meetup</p>
                  <p className="mt-1 text-[15.5px] font-semibold text-white">{nextEvent.when.headline}</p>
                  <div className="mt-4 flex items-center gap-2.5">
                    <AvatarStack
                      people={nextEvent.attendees}
                      total={nextEvent.attendeeCount}
                      max={4}
                      size={26}
                      className="[&>span]:ring-ink"
                    />
                    <span className="text-[13.5px] text-white/65">
                      {nextEvent.attendeeCount} going
                      {totalAttendees > 0 && ` · ${totalAttendees.toLocaleString("en-IN")} have come before`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-4 rounded-panel border border-line bg-white p-6 lg:hidden">
          <ul className="flex flex-col gap-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-muted">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>

          {nextEvent && (
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <AvatarStack people={nextEvent.attendees} total={nextEvent.attendeeCount} max={4} size={28} />
              <div className="min-w-0">
                <p className="text-[13px] text-subtle">Next meetup</p>
                <p className="truncate text-[14.5px] font-semibold text-ink">
                  {nextEvent.when.headline.split(" · ")[0]} · {nextEvent.attendeeCount} going
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
