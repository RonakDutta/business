import { useState } from "react";
import { Link } from "react-router-dom";
import MapEmbed from "../components/MapEmbed.jsx";
import MetroRoute from "../components/MetroRoute.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { VENUE } from "../data/venue.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowUpRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "../components/icons.jsx";
import { Rings, Orb, Scatter } from "../components/Decor.jsx";

/* ===========================================================================
   CONTACT

   There's no form backend, and rather than fake one, "Send" opens the
   visitor's own mail app with the message already written. It works today, it
   works offline, and nothing silently swallows a message that was never going
   anywhere. Swap `sendVia` for a POST when there's somewhere to POST to.

   Only channels that actually reach someone are listed. If the community adds
   an Instagram or a LinkedIn page later, drop another <Channel> in , there are
   icons for both in components/icons.jsx already.
   =========================================================================== */

const EMAIL = "hello@business4.com";

const TOPICS = [
  "Coming to a meetup",
  "Speaking or hosting a session",
  "Partnering with the community",
  "Something else",
];

function Channel({ icon: Icon, label, value, href, note, external }) {
  const Wrap = href ? "a" : "div";
  const props = href
    ? {
        href,
        ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      }
    : {};

  return (
    <Wrap
      {...props}
      className={`group flex items-start gap-4 rounded-card border border-line bg-white p-5 transition-[border-color,translate] duration-300 ease-smooth ${
        href ? "hover:-translate-y-0.5 hover:border-[#dfe3ea]" : ""
      }`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
          {label}
        </div>
        <div className="mt-1 break-words text-[15px] font-bold text-ink">
          {value}
        </div>
        {note && (
          <div className="mt-1.5 text-[12.5px] leading-relaxed text-subtle">
            {note}
          </div>
        )}
      </div>

      {href && (
        <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-faint transition-colors duration-200 group-hover:text-accent" />
      )}
    </Wrap>
  );
}

export default function Contact() {
  const { meetupUrl } = useTheme();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    topic: TOPICS[0],
    message: "",
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useReveal([]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const send = () => {
    if (!form.name.trim()) return setError("We'd like to know who's writing.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("That email doesn't look right , we reply to it.");
    if (form.message.trim().length < 10)
      return setError("Tell us a bit more so we can actually answer.");

    setError("");

    const body = `${form.message.trim()}\n\n, ${form.name.trim()}\n${form.email.trim()}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `${form.topic} , Business 4.0`,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  const field =
    "w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-[15px] text-ink transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none";

  return (
    <div className="relative isolate mx-auto max-w-shell overflow-hidden px-6 pb-24 pt-14 md:px-10">
      {/* "Reach out" ripples + a soft orb behind the header. Decorative. */}
      <Rings className="pointer-events-none absolute -right-16 -top-16 -z-10 hidden h-80 w-80 text-accent md:block" />
      <Orb className="pointer-events-none absolute -left-24 -top-10 -z-10 h-64 w-64 text-accent blur-2xl" />

      <header className="max-w-[640px]">
        <div className="reveal accent-border inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-xs font-bold tracking-[0.1em] text-accent backdrop-blur">
          <MailIcon className="h-3.5 w-3.5" />
          GET IN TOUCH
        </div>

        <h1
          data-delay="0.06"
          className="reveal mt-7 text-[36px] font-extrabold leading-[1.08] tracking-[-0.035em] [text-wrap:balance] md:text-[52px]"
        >
          Talk to the{" "}
          <span className="relative whitespace-nowrap text-accent">
            organisers
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint"
            />
          </span>
          .
        </h1>

        <p
          data-delay="0.12"
          className="reveal mt-5 text-[17px] leading-[1.7] text-muted [text-wrap:pretty]"
        >
          Four of us run this between day jobs, so give us a couple of days. If
          it's about coming along, the{" "}
          <Link to="/guidelines" className="font-bold text-accent">
            guidelines
          </Link>{" "}
          probably answer it faster than we will.
        </p>
      </header>

      <div className="mt-14 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_460px] lg:gap-12">
        {/* Channels */}
        <div className="reveal flex flex-col gap-3">
          <Channel
            icon={MailIcon}
            label="Email"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
            note="Best for anything that needs a real answer."
          />

          <Channel
            icon={PhoneIcon}
            label="Helpline"
            value={VENUE.helpline}
            href={`tel:${VENUE.helpline}`}
            note={VENUE.helplineNote}
          />

          <Channel
            icon={MapPinIcon}
            label="Where we meet"
            value={VENUE.name}
            note={`${VENUE.address} · ${VENUE.city}. Enter via ${VENUE.gate}.`}
          />

          <Channel
            icon={UsersIcon}
            label="Meetup"
            value="meetup.com/business4-0"
            href={meetupUrl}
            external
            note="Every edition, past and upcoming, with the RSVP list."
          />

          <div className="mt-3 overflow-hidden rounded-card">
            <MapEmbed location={VENUE} title={VENUE.name} />
          </div>

          <div className="rounded-card border border-line bg-white p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
              Nearest metro
            </div>
            <MetroRoute metro={VENUE.metro} className="mt-4" />
          </div>
        </div>

        {/* Message */}
        <aside className="reveal lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-panel border border-line bg-white p-6 shadow-[0_20px_50px_-40px_rgba(15,23,42,.5)] md:p-8">
            <Scatter className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-accent/50" />
            <div className="relative">
            {sent ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
                  <MailIcon className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-[22px] font-extrabold tracking-[-0.03em]">
                  Your mail app is open
                </h2>
                <p className="mx-auto mt-2.5 max-w-[300px] text-[14.5px] leading-relaxed text-muted">
                  The message is drafted and addressed to {EMAIL} , hit send
                  there and it's on its way.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm font-bold text-accent"
                >
                  Write another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-[22px] font-extrabold tracking-[-0.03em]">
                  Send us a message
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-subtle">
                  This opens your own mail app with the message ready to go.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-[0.07em] text-subtle">
                      Your name
                    </span>
                    <input
                      className={field}
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Who's writing?"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-[0.07em] text-subtle">
                      Email
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      className={field}
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@email.com"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-[0.07em] text-subtle">
                      What's it about
                    </span>
                    <select
                      className={`${field} appearance-none`}
                      value={form.topic}
                      onChange={set("topic")}
                    >
                      {TOPICS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-[0.07em] text-subtle">
                      Message
                    </span>
                    <textarea
                      rows={5}
                      className={`${field} resize-y leading-relaxed`}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Keep it short , we read everything."
                    />
                  </label>

                  {error && (
                    <p className="text-sm font-semibold text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={send}
                    className="mt-1 w-full rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
                  >
                    Send message
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
