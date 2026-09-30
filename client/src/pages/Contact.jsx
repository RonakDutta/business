import { useState } from "react";
import { Link } from "react-router-dom";
import MapEmbed from "../components/MapEmbed.jsx";
import MetroRoute from "../components/MetroRoute.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Spinner from "../components/Spinner.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { VENUE } from "../data/venue.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowUpRightIcon,
  CheckIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
} from "../components/icons.jsx";
import { contactApi } from "../api";

/* ===========================================================================
   CONTACT

   The message form posts to the server, which saves it and copies it to the
   organisers' Google Sheet. Only channels that actually reach someone are
   listed next to it.
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
    ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
    : {};

  return (
    <li>
      <Wrap
        {...props}
        className={`group flex items-start gap-4 p-5 sm:p-6 ${
          href ? "transition-colors duration-200 hover:bg-surface" : ""
        }`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-accent">
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="meta-label">{label}</div>
          <div className="mt-1 break-words text-[15.5px] font-semibold text-ink">{value}</div>
          {note && <div className="mt-1 text-[13.5px] leading-relaxed text-subtle">{note}</div>}
        </div>

        {href && (
          <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-faint transition-colors duration-200 group-hover:text-accent" />
        )}
      </Wrap>
    </li>
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
  const [sending, setSending] = useState(false);

  useReveal([]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const send = async () => {
    if (sending) return;
    if (!form.name.trim()) return setError("Please tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("That email doesn't look right. We reply to it.");
    if (form.message.trim().length < 10)
      return setError("Tell us a bit more so we can actually answer.");

    setError("");
    setSending(true);

    try {
      await contactApi.sendMessage(
        form.name.trim(),
        form.email.trim(),
        form.topic,
        form.message.trim(),
      );
      setSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        title="Talk to the organisers"
        lead={
          <>
            Four of us run this between day jobs, so give us a couple of days.
            If it's about coming along, the{" "}
            <Link to="/guidelines" className="link">
              guidelines
            </Link>{" "}
            probably answer it faster than we will.
          </>
        }
      />

      <div className="shell grid grid-cols-1 items-start gap-10 pb-24 pt-10 md:pt-14 lg:grid-cols-[1fr_460px] lg:gap-14">
        <div className="flex flex-col gap-6">
          <ul className="reveal card divide-y divide-line overflow-hidden">
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
              note={`${VENUE.address}, ${VENUE.city}. Enter via ${VENUE.gate}.`}
            />
            <Channel
              icon={UsersIcon}
              label="Meetup"
              value="meetup.com/business4-0"
              href={meetupUrl}
              external
              note="Every edition, past and upcoming, with the RSVP list."
            />
          </ul>

          <div className="reveal">
            <MapEmbed location={VENUE} title={VENUE.name} />
          </div>

          <div className="reveal card p-6">
            <h2 className="text-[17px] font-semibold">Nearest metro</h2>
            <MetroRoute metro={VENUE.metro} className="mt-5" />
          </div>
        </div>

        <aside className="reveal lg:sticky lg:top-28">
          <div className="card p-6 md:p-8">
            {sent ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
                  <CheckIcon className="h-7 w-7" />
                </span>
                <h2 className="display-3 mt-5">Message sent</h2>
                <p className="mx-auto mt-2.5 max-w-[300px] text-[15px] leading-relaxed text-muted">
                  Thanks. We've got it and we'll reply to {form.email} soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn btn-secondary btn-sm mt-6"
                >
                  Write another
                </button>
              </div>
            ) : (
              <>
                <h2 className="display-3">Send us a message</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-subtle">
                  It goes straight to the organisers. We read everything.
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="field-label">Your name</span>
                    <input
                      className="field"
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="field-label">Email</span>
                    <input
                      type="email"
                      autoComplete="email"
                      className="field"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@email.com"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="field-label">What it's about</span>
                    <select className="field" value={form.topic} onChange={set("topic")}>
                      {TOPICS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="field-label">Message</span>
                    <textarea
                      rows={5}
                      className="field resize-y"
                      value={form.message}
                      onChange={set("message")}
                      placeholder="What would you like to ask?"
                    />
                  </label>

                  {error && (
                    <p role="alert" className="text-[14px] font-semibold text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={send}
                    disabled={sending}
                    className="btn btn-primary btn-lg mt-1 w-full"
                  >
                    {sending && <Spinner className="h-4 w-4" />}
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
