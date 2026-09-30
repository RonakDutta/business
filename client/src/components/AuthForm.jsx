import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AvatarStack from "./AvatarStack.jsx";
import BackLink from "./BackLink.jsx";
import Wordmark from "./Wordmark.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { Sparkle, CurlyArrow, Squiggle, ClayBall } from "./Decor.jsx";
import Spinner from "./Spinner.jsx";
import {
  CalendarIcon,
  CheckIcon,
  HeartIcon,
  ImageIcon,
} from "./icons.jsx";

/* ===========================================================================
   Shared shell for Login and Signup.

   Every meetup starts the same way: everyone says who they are. So the page
   is built around a name badge, the kind you'd stick on at the door, that
   fills in live as you type. Signing up writes your name on it; signing in
   greets you by the name in your email. The form sits beside it in one soft
   card, with a pill switch between the two modes that mirrors the navbar.

   On phones the badge shrinks to a compact strip above the form, so the
   form is still the first thing you can act on.
   =========================================================================== */

/* Local to this file, the only place in the app that needs an eye. */
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
  { icon: CalendarIcon, text: "RSVP in one tap" },
  { icon: HeartIcon, text: "Save the editions you like" },
  { icon: ImageIcon, text: "Your photos, in one place" },
];

/* "priya.sharma@x.com" -> "Priya". Only used for the greeting on sign in. */
function nameFromEmail(email) {
  const local = email.split("@")[0] || "";
  const first = local.split(/[._\-+0-9]/).find(Boolean) || "";
  return first ? first[0].toUpperCase() + first.slice(1).toLowerCase() : "";
}

/* ---------------------------------------------------------------------------
   The badge
   --------------------------------------------------------------------------- */
function NameBadge({ name, placeholder, greeting, event, compact = false }) {
  if (compact) {
    return (
      <div className="clay-soft clay-edge flex items-center gap-4 overflow-hidden rounded-[22px] border bg-white">
        <div className="relative self-stretch bg-accent px-4 py-3 text-white">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1px,transparent_1.6px)] bg-[length:12px_12px]"
          />
          <div className="relative text-[17px] font-extrabold leading-none">
            Hello
          </div>
          <div className="relative mt-1 text-[11px] font-semibold text-white/80">
            {greeting}
          </div>
        </div>
        <div
          className={`min-w-0 flex-1 truncate py-3 pr-4 text-[20px] font-extrabold tracking-[-0.03em] ${
            name ? "text-ink" : "text-faint"
          }`}
        >
          {name || placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      {/* Lanyard clip */}
      <div className="relative z-10 mx-auto -mb-3 flex h-9 w-20 items-center justify-center rounded-2xl clay-blue">
        <span className="h-2 w-10 rounded-full bg-accent/25 shadow-[inset_0_1px_2px_rgba(30,58,138,.3)]" />
      </div>

      <div className="clay clay-edge relative -rotate-2 overflow-hidden rounded-[30px] border bg-white">
        {/* Header band */}
        <div className="relative bg-accent px-7 pb-5 pt-7 text-white">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.18)_1.2px,transparent_1.8px)] bg-[length:16px_16px]"
          />
          <div className="relative text-[34px] font-extrabold leading-none tracking-[-0.03em]">
            Hello
          </div>
          <div className="relative mt-1.5 text-[15px] font-semibold text-white/85">
            {greeting}
          </div>
        </div>

        {/* The name line */}
        <div className="px-7 pb-6 pt-8">
          <div
            className={`min-h-[48px] truncate text-[38px] font-extrabold leading-tight tracking-[-0.035em] transition-colors duration-200 ${
              name ? "text-ink" : "text-faint"
            }`}
          >
            {name || placeholder}
          </div>
          <Squiggle className="mt-1 h-3 w-28 text-accent/40" />
        </div>

        {/* Stub */}
        <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-line px-7 py-4">
          <Wordmark size="sm" />
          {event && (
            <div className="flex items-center gap-2">
              <AvatarStack
                people={event.attendees}
                total={event.attendeeCount}
                max={3}
                size={24}
              />
              <span className="text-[12px] font-bold text-subtle">
                {event.attendeeCount} going
              </span>
            </div>
          )}
        </div>
      </div>

      <Sparkle className="bob pointer-events-none absolute -right-4 top-10 h-10 w-10 text-accent [--r:12deg]" />
      <ClayBall className="absolute -bottom-4 -left-5 h-11 w-11" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The page
   --------------------------------------------------------------------------- */
export default function AuthForm({ mode = "login", onSubmit }) {
  const isSignup = mode === "signup";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { upcomingEvents } = useEvents();

  useReveal([mode]);

  const next = params.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nextEvent = upcomingEvents.find((e) => !e.cancelled);

  /* Coming from an RSVP? Say so, otherwise the redirect back looks random. */
  const returning = next.startsWith("/events/");
  const keepNext = next !== "/" ? `?next=${encodeURIComponent(next)}` : "";

  const badgeName = isSignup ? name.trim() : nameFromEmail(email);
  const badgeProps = {
    name: badgeName,
    placeholder: isSignup ? "Your name" : "Good to see you",
    greeting: isSignup ? "my name is" : "welcome back",
    event: nextEvent,
  };

  const passwordOk = password.length >= 6;

  const submit = async () => {
    if (submitting) return;
    if (isSignup && !name.trim()) return setError("Tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email doesn't look right.");
    if (!passwordOk)
      return setError("Password needs to be at least 6 characters.");

    setError("");
    setSubmitting(true);
    try {
      // onSubmit may be async (real API) or sync (stub). Awaiting handles
      // both, and we only navigate once it resolves, so a failed sign-in
      // stays put.
      await onSubmit({ name: name.trim(), email: email.trim(), password });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "clay-inset clay-edge w-full rounded-2xl border bg-canvas px-4 py-3.5 text-[15px] text-ink transition-[border-color,background] duration-200 placeholder:text-faint focus:border-accent focus:bg-white focus:outline-none";
  const labelCls = "text-[13px] font-bold text-ink";

  const tab = (active) =>
    `rounded-full py-2.5 text-center text-[13.5px] font-bold transition-[color,background,box-shadow] duration-200 ${
      active ? "clay bg-white text-ink" : "text-muted hover:text-ink"
    }`;

  return (
    <section className="relative isolate mx-auto max-w-shell px-5 pb-16 pt-6 sm:px-6 sm:pt-8 md:px-10 lg:pb-24">
      <BackLink to="/">Back home</BackLink>

      <div className="mt-6 grid items-center gap-8 lg:mt-10 lg:grid-cols-[1fr_460px] lg:gap-16">
        {/* ---- Badge stage (desktop) ------------------------------------ */}
        <div className="reveal relative hidden lg:block">
          <div
            aria-hidden
            className="pattern-dots absolute inset-x-6 inset-y-0 -z-10 rounded-[40px] [mask-image:radial-gradient(70%_70%_at_50%_45%,#000,transparent)]"
          />

          <div className="px-6 py-10">
            <NameBadge {...badgeProps} />

            <ul className="mx-auto mt-12 flex max-w-[460px] flex-wrap justify-center gap-2.5">
              {PERKS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="clay-edge inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-[13px] font-semibold text-muted"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <CurlyArrow className="pointer-events-none absolute -right-14 top-1/3 h-20 w-28 rotate-[-10deg] text-accent/40" />
        </div>

        {/* ---- Form ------------------------------------------------------ */}
        <div className="reveal" data-delay="0.08">
          <div className="mb-5 lg:hidden">
            <NameBadge {...badgeProps} compact />
          </div>

          <div className="clay-soft clay-edge rounded-[30px] border bg-white p-6 sm:p-8">
            {/* Mode switch, the same pill track as the navbar */}
            <div className="clay-inset grid grid-cols-2 gap-1 rounded-full bg-canvas p-1">
              <Link to={`/login${keepNext}`} className={tab(!isSignup)}>
                Sign in
              </Link>
              <Link to={`/signup${keepNext}`} className={tab(isSignup)}>
                Create account
              </Link>
            </div>

            <h1 className="relative isolate mt-7 text-[28px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[32px]">
              {isSignup ? (
                <>
                  Save your{" "}
                  <span className="relative whitespace-nowrap text-accent">
                    seat
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 -z-10 h-[0.45em] rounded-full accent-tint"
                    />
                  </span>
                </>
              ) : (
                <>
                  Welcome{" "}
                  <span className="relative whitespace-nowrap text-accent">
                    back
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 -z-10 h-[0.45em] rounded-full accent-tint"
                    />
                  </span>
                </>
              )}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {isSignup
                ? "Takes a minute. You need an account to RSVP for a meetup."
                : "Sign in to RSVP and keep track of the meetups you're going to."}
            </p>

            {returning && (
              <div className="accent-tint accent-border mt-5 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[13px] font-semibold leading-relaxed text-accent">
                <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0" />
                Finish signing in and we'll take you straight back to your RSVP.
              </div>
            )}

            <form
              className="mt-6 flex flex-col gap-4"
              noValidate
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
                    placeholder="What goes on your badge?"
                    value={name}
                    maxLength={40}
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
                  inputMode="email"
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
                      className="text-[12.5px] font-bold text-subtle transition-colors duration-200 hover:text-accent"
                    >
                      Forgotten it?
                    </Link>
                  )}
                </span>

                <span className="relative block">
                  <input
                    className={`${field} pr-12`}
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
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-faint transition-colors duration-200 hover:bg-white hover:text-ink"
                  >
                    <EyeIcon off={show} className="h-[18px] w-[18px]" />
                  </button>
                </span>

                {isSignup && (
                  <span
                    className={`mt-0.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors duration-200 ${
                      passwordOk ? "text-emerald-600" : "text-subtle"
                    }`}
                  >
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full transition-colors duration-200 ${
                        passwordOk ? "bg-emerald-500 text-white" : "bg-line text-transparent"
                      }`}
                    >
                      <CheckIcon className="h-2.5 w-2.5" />
                    </span>
                    6 characters or more
                  </span>
                )}
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="clay clay-press mt-2 flex items-center justify-center gap-2 rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-ink"
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

            <p className="mt-6 text-center text-[13px] leading-relaxed text-subtle">
              {isSignup ? (
                <>
                  By joining you agree to the{" "}
                  <Link to="/guidelines" className="font-bold text-accent">
                    house rules
                  </Link>
                  .
                </>
              ) : (
                <>
                  New here?{" "}
                  <Link to={`/signup${keepNext}`} className="font-bold text-accent">
                    Create an account
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Perks for phones, where the badge stage is hidden */}
          <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:hidden">
            {PERKS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="clay-edge inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[12.5px] font-semibold text-muted"
              >
                <Icon className="h-3.5 w-3.5 text-accent" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
