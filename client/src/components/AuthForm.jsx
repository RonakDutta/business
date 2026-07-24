import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BackLink from "./BackLink.jsx";
import AvatarStack from "./AvatarStack.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { Orb, ConnectionMesh } from "./Decor.jsx";
import Spinner from "./Spinner.jsx";
import { CheckIcon, ShieldIcon, UsersIcon, CalendarIcon } from "./icons.jsx";

/* ===========================================================================
   Shared shell for Login and Signup.

   A split panel: the form on the left, and on the right the reason you're
   filling it in — the room you're joining, drawn from the real event data
   rather than marketing copy. The right panel is display-only and hidden
   under lg; on a phone the form is the whole page, so the same social proof
   is folded into a compact strip beneath it instead of being dropped.
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

  /* Coming from an RSVP? Say so — otherwise the redirect back looks random. */
  const returning = next.startsWith("/events/");

  const submit = async () => {
    if (submitting) return;
    if (isSignup && !name.trim()) return setError("Tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email doesn't look right.");
    if (password.length < 6)
      return setError("Password needs to be at least 6 characters.");

    setError("");
    setSubmitting(true);
    try {
      // onSubmit may be async (real API) or sync (stub) — await handles both,
      // and we only navigate once it resolves, so a failed sign-in stays put.
      await onSubmit({ name: name.trim(), email: email.trim(), password });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-line-strong bg-[#fafbfc] px-4 py-3.5 text-[15px] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.8)] transition-[border-color,background,box-shadow] duration-200 placeholder:text-faint focus:border-accent focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--b4-accent)_10%,transparent)] focus:outline-none";
  const labelCls =
    "text-[11.5px] font-bold uppercase tracking-[0.07em] text-subtle";

  const EyebrowIcon = isSignup ? UsersIcon : ShieldIcon;
  const eyebrowText = isSignup ? "Join the community" : "Member access";
  const [titleHead, titleTail] = isSignup
    ? ["Create your ", "account"]
    : ["Welcome ", "back"];

  return (
    <section className="relative isolate mx-auto max-w-shell px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14">
      {/* Vector backdrop. No overflow-hidden, so the glow fades softly and the
          mesh is masked — consistent with the rest of the site. */}
      <Orb className="pointer-events-none absolute -left-24 -top-6 -z-10 h-64 w-64 text-accent blur-3xl" />
      <ConnectionMesh className="pointer-events-none absolute -right-6 top-0 -z-10 h-40 w-56 text-accent opacity-50 [-webkit-mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)] [mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)] sm:h-56 sm:w-80 lg:hidden" />

      <BackLink to="/">Back home</BackLink>

      <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_30px_70px_-50px_rgba(15,23,42,.6)] lg:grid-cols-[1fr_440px]">
        {/* ---- Form ------------------------------------------------- */}
        <div className="bg-gradient-to-b from-white to-[#fafbfc] p-6 sm:p-9 md:p-12">
          <div className="mx-auto max-w-[380px]">
            {returning && (
              <div className="accent-tint accent-border mb-6 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[13px] font-semibold leading-relaxed text-accent">
                <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0" />
                Sign in to finish your RSVP — we'll take you straight back to it.
              </div>
            )}

            <div className="reveal flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
              <EyebrowIcon className="h-3.5 w-3.5" />
              {eyebrowText}
            </div>

            <h1
              data-delay="0.06"
              className="reveal mt-3 text-[30px] font-extrabold tracking-[-0.035em] md:text-[36px]"
            >
              {titleHead}
              <span className="relative whitespace-nowrap text-accent">
                {titleTail}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint"
                />
              </span>
            </h1>
            <p
              data-delay="0.12"
              className="reveal mt-2.5 text-[15px] leading-relaxed text-muted"
            >
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
                disabled={submitting}
                className="mt-2 flex items-center justify-center gap-2 rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white shadow-[0_12px_20px_-14px_rgba(15,23,42,.6)] transition-[translate,background,box-shadow] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_16px_24px_-16px_var(--b4-accent)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-ink"
              >
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

        {/* ---- The room you're joining (desktop) -------------------- */}
        <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <ConnectionMesh className="pointer-events-none absolute -right-8 -top-10 h-72 w-96 text-white/[0.12]" />
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

      {/* ---- Same value, folded into a strip for phones ------------- */}
      <div className="reveal mt-4 rounded-[24px] border border-line bg-white p-5 shadow-[0_20px_50px_-45px_rgba(15,23,42,.55)] lg:hidden">
        <ul className="flex flex-col gap-3">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                <CheckIcon className="h-3 w-3" />
              </span>
              <span className="text-[14px] leading-snug text-muted">{p}</span>
            </li>
          ))}
        </ul>

        {nextEvent && (
          <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
            <AvatarStack
              people={nextEvent.attendees}
              total={nextEvent.attendeeCount}
              max={4}
              size={28}
            />
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-subtle">
                Next meetup
              </div>
              <div className="truncate text-[13.5px] font-bold text-ink">
                {nextEvent.when.headline.split(" · ")[0]} ·{" "}
                {nextEvent.attendeeCount} going
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
