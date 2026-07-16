import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import { VENUE } from "../data/venue.js";
import { priceLabel } from "../lib/format.js";
import { ArrowRightIcon, CheckIcon, CloseIcon } from "../components/icons.jsx";

const PHASES = [
  {
    id: "before",
    n: "01",
    title: "Before you come",
    points: [
      "RSVP on this site or on Meetup so we know how many chairs to put out. The room is a real room, it fills up.",
      "Pay the entry fee when you RSVP and skip the queue at the gate. Cash or UPI at the door works too.",
      "Come a few minutes early. We start at 11:00 and the intros go first.",
      `Enter via ${VENUE.gate}. The helpline is for finding the gate on the day — not for questions about the meetup.`,
    ],
  },
  {
    id: "in-the-room",
    n: "02",
    title: "In the room",
    points: [
      "Everyone introduces themselves — name, what you're building, what you're stuck on. Keep it under a minute.",
      "Conversations, not pitches. If someone wants what you sell, they'll ask you afterwards.",
      "Listen more than you talk. The best sessions are the ones where the quietest person says something nobody expected.",
      "Photos get taken. Tell an organiser if you'd rather stay out of them and we'll work around you.",
    ],
  },
  {
    id: "after",
    n: "03",
    title: "After",
    points: [
      "Conversations usually overflow past 1:00 PM. Keep a couple of hours spare if you can.",
      "Photos go up in the gallery within a few days.",
      "Can't make the next one? Cancel your RSVP so the seat goes to someone else.",
      "We're back in two weeks, same place, same time. It's every fortnight, no exceptions.",
    ],
  },
];

const DO = [
  "Follow up with people you met, that's the whole point",
  "Ask questions in the room, not just in the corridor after",
  "Tell us if something in the session didn't work",
  "Bring someone who'd get something out of it",
];

const DONT = [
  "Pitch from the floor or work the room selling",
  "Add everyone to a mailing list you started on the way home",
  "Record or stream the session without asking first",
  "Leave litter, it's a private space and we'd like to stay welcome",
];

function Rule({ text, allowed }) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
          allowed ? "bg-accent/10 text-accent" : "bg-red-50 text-red-500"
        }`}
      >
        {allowed ? (
          <CheckIcon className="h-3 w-3" />
        ) : (
          <CloseIcon className="h-3 w-3" />
        )}
      </span>
      <span className="text-[14.5px] leading-relaxed text-muted">{text}</span>
    </li>
  );
}

export default function Guidelines() {
  const { upcomingEvents } = useEvents();
  const next = upcomingEvents.find((e) => !e.cancelled);

  useReveal([]);

  return (
    <div className="mx-auto max-w-shell px-6 pb-24 pt-14 md:px-10">
      <header className="max-w-[700px]">
        <div className="reveal accent-border inline-flex items-center rounded-full border px-[18px] py-2 text-xs font-bold tracking-[0.1em] text-accent">
          COMMUNITY GUIDELINES
        </div>

        <h1
          data-delay="0.06"
          className="reveal mt-7 text-[36px] font-extrabold leading-[1.08] tracking-[-0.035em] [text-wrap:balance] md:text-[52px]"
        >
          How a meetup actually runs.
        </h1>

        <p
          data-delay="0.12"
          className="reveal mt-5 text-[17px] leading-[1.7] text-muted [text-wrap:pretty]"
        >
          Two hours, every two weeks, same room. No badges, no breakout
          exercises, no one reading slides at you. Here's what to expect and
          what we expect back.
        </p>
      </header>

      {/* Three phases — a sequence, hence the numbers. */}
      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav className="reveal hidden lg:block">
          <div className="sticky top-28">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-subtle">
              On this page
            </div>
            <ul className="mt-4 flex flex-col gap-3 border-l border-line pl-4">
              {PHASES.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="text-[13.5px] font-bold text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#house-rules"
                  className="text-[13.5px] font-bold text-muted transition-colors duration-200 hover:text-accent"
                >
                  House rules
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex flex-col gap-12">
          {PHASES.map((phase) => (
            <section
              key={phase.id}
              id={phase.id}
              className="reveal scroll-mt-28 border-t border-line pt-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[13px] font-bold text-accent">
                  {phase.n}
                </span>
                <h2 className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[30px]">
                  {phase.title}
                </h2>
              </div>

              <ul className="mt-6 flex flex-col gap-4 lg:pl-10">
                {phase.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-4 text-[15.5px] leading-[1.7] text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[11px] h-[3px] w-4 shrink-0 rounded-full bg-line-strong"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* House rules — deliberately unnumbered; they aren't in any order. */}
          <section
            id="house-rules"
            className="reveal scroll-mt-28 border-t border-line pt-8"
          >
            <h2 className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[30px]">
              House rules
            </h2>
            <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-muted">
              Short list, seriously meant. Harassment, of any kind, gets you
              asked to leave and not invited back — no warning, no debate.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-line bg-white p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-accent">
                  Please do
                </div>
                <ul className="mt-4 flex flex-col gap-3.5">
                  {DO.map((t) => (
                    <Rule key={t} text={t} allowed />
                  ))}
                </ul>
              </div>

              <div className="rounded-card border border-line bg-white p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-red-500">
                  Please don't
                </div>
                <ul className="mt-4 flex flex-col gap-3.5">
                  {DONT.map((t) => (
                    <Rule key={t} text={t} allowed={false} />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Hand-off: guidelines read, now go do something. */}
          <section className="reveal overflow-hidden rounded-panel bg-ink p-8 text-white md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-[24px] font-extrabold tracking-[-0.03em] md:text-[28px]">
                  {next ? "That's it. Come along." : "That's it."}
                </h2>
                <p className="mt-2.5 max-w-[420px] text-[14.5px] leading-relaxed text-white/60">
                  {next
                    ? `Next one is ${next.when.headline.split(" · ")[0]} at ${VENUE.shortName} · ${priceLabel(next.entryFee)}.`
                    : "The next date isn't up yet. Check back — it's every second Saturday."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {next && (
                  <Link
                    to={`/events/${next.id}`}
                    className="inline-flex items-center gap-2 rounded-btn bg-white px-6 py-3.5 text-sm font-bold text-ink transition-[translate] duration-300 ease-smooth hover:-translate-y-0.5"
                  >
                    RSVP
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="rounded-btn border border-white/20 px-6 py-3.5 text-sm font-bold text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white"
                >
                  Ask us something
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
