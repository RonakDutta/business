import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import { VENUE } from "../data/venue.js";
import { priceLabel } from "../lib/format.js";
import MetroRoute from "../components/MetroRoute.jsx";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  MapPinIcon,
  TicketIcon,
} from "../components/icons.jsx";

/* ===========================================================================
   COPY LIVES HERE ON PURPOSE.

   This is the organising team's page, not an engineering one , the wording is
   a first draft written from what's already on the meetup listing
   (fortnightly, 11-1, Gate No. 1, the helpline note). Rewrite it in your own
   words; nothing here is wired to anything.

   The three phases are numbered because they're an actual sequence , before,
   during, after. The house rules aren't a sequence, so they aren't numbered.
   =========================================================================== */

const FACTS = [
  { icon: CalendarIcon, label: "How often", value: "Every 2nd Saturday" },
  { icon: ClockIcon, label: "Hours", value: "11:00 AM – 1:00 PM" },
  { icon: TicketIcon, label: "Entry", value: "₹150" },
  { icon: MapPinIcon, label: "Door", value: VENUE.gate },
];

const PHASES = [
  {
    id: "before",
    n: "01",
    title: "Before you come",
    lede: "Ten minutes of admin that saves everyone an awkward start.",
    points: [
      "RSVP on this site or on Meetup so we know how many chairs to put out. The room is a real room , it fills up.",
      "Pay the entry fee when you RSVP and skip the queue at the gate. Cash or UPI at the door works too.",
      "Come a few minutes early. We start at 11:00 and the intros go first.",
      `Enter via ${VENUE.gate}. The helpline is for finding the gate on the day , not for questions about the meetup.`,
    ],
  },
  {
    id: "in-the-room",
    n: "02",
    title: "In the room",
    lede: "Two hours. No badges, no breakouts, nobody reading slides at you.",
    points: [
      "Everyone introduces themselves , name, what you're building, what you're stuck on. Keep it under a minute.",
      "Conversations, not pitches. If someone wants what you sell, they'll ask you afterwards.",
      "Listen more than you talk. The best sessions are the ones where the quietest person says something nobody expected.",
      "Photos get taken. Tell an organiser if you'd rather stay out of them and we'll work around you.",
    ],
  },
  {
    id: "after",
    n: "03",
    title: "After",
    lede: "The part most people say was worth the trip.",
    points: [
      "Conversations usually overflow past 1:00 PM. Keep a couple of hours spare if you can.",
      "Photos go up in the gallery within a few days.",
      "Can't make the next one? Cancel your RSVP so the seat goes to someone else.",
      "We're back in two weeks, same place, same time. Every fortnight, no exceptions.",
    ],
  },
];

const DO = [
  "Follow up with people you met , that's the whole point",
  "Ask questions in the room, not just in the corridor after",
  "Tell us if something in the session didn't work",
  "Bring someone who'd get something out of it",
];

const DONT = [
  "Pitch from the floor or work the room selling",
  "Add everyone to a mailing list you started on the way home",
  "Record or stream the session without asking first",
  "Leave litter , it's a public park and we'd like to stay welcome",
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

  const tocCls =
    "text-[13.5px] font-bold text-muted transition-colors duration-200 hover:text-accent";

  return (
    <div className="mx-auto max-w-shell px-6 pb-24 pt-14 md:px-10">
      <header className="max-w-[720px]">
        <div className="reveal accent-border inline-flex items-center rounded-full border px-[18px] py-2 text-xs font-bold tracking-[0.1em] text-accent">
          COMMUNITY GUIDELINES
        </div>

        <h1
          data-delay="0.06"
          className="reveal mt-7 text-[36px] font-extrabold leading-[1.08] tracking-[-0.035em] [text-wrap:balance] md:text-[54px]"
        >
          How a meetup actually runs.
        </h1>

        <p
          data-delay="0.12"
          className="reveal mt-5 text-[17px] leading-[1.7] text-muted [text-wrap:pretty]"
        >
          Two hours, every two weeks, same room. Here's what to expect and what
          we expect back , read it once and you'll walk in like a regular.
        </p>
      </header>

      {/* The four things people ask before anything else. */}
      <div
        data-delay="0.18"
        className="reveal mt-10 grid grid-cols-2 divide-line rounded-panel border border-line bg-white sm:grid-cols-4 sm:divide-x"
      >
        {FACTS.map((f) => (
          <div key={f.label} className="flex items-center gap-3 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <f.icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-subtle">
                {f.label}
              </div>
              <div className="mt-0.5 truncate text-[14.5px] font-bold text-ink">
                {f.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[210px_1fr] lg:gap-16">
        <nav className="reveal hidden lg:block">
          <div className="sticky top-28">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-subtle">
              On this page
            </div>
            <ul className="mt-4 flex flex-col gap-3 border-l border-line pl-4">
              {PHASES.map((p) => (
                <li key={p.id}>
                  <a href={`#${p.id}`} className={tocCls}>
                    {p.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#house-rules" className={tocCls}>
                  House rules
                </a>
              </li>
              <li>
                <a href="#getting-here" className={tocCls}>
                  Getting here
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex flex-col gap-5">
          {/* Phases: cards on a spine. Numbered because before/during/after is
              a real order, not decoration. */}
          {PHASES.map((phase) => (
            <section
              key={phase.id}
              id={phase.id}
              className="reveal scroll-mt-28 overflow-hidden rounded-panel border border-line bg-white"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line bg-[#fbfcfd] px-6 py-5 md:px-8">
                <span className="font-mono text-[12px] font-bold text-accent">
                  {phase.n}
                </span>
                <h2 className="text-[22px] font-extrabold tracking-[-0.03em] md:text-[26px]">
                  {phase.title}
                </h2>
                <p className="w-full text-[13.5px] text-subtle md:w-auto md:flex-1 md:text-right">
                  {phase.lede}
                </p>
              </div>

              <ul className="flex flex-col gap-4 px-6 py-6 md:px-8">
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

          {/* House rules , deliberately unnumbered; they aren't in any order. */}
          <section id="house-rules" className="reveal mt-6 scroll-mt-28">
            <h2 className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[30px]">
              House rules
            </h2>
            <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-muted">
              Short list, seriously meant.
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

            {/* The one rule that isn't a matter of taste, so it doesn't sit in
                a column with the ones that are. */}
            <div className="mt-4 flex gap-4 rounded-card border border-red-200 bg-red-50/60 p-6">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-600 text-[13px] font-extrabold text-white">
                !
              </span>
              <p className="text-[14.5px] leading-relaxed text-ink">
                <b>Harassment, of any kind, ends your membership.</b> You'll be
                asked to leave and you won't be invited back , no warning, no
                debate. If anything happens in the room, find an organiser. If
                you'd rather not do that in person,{" "}
                <Link
                  to="/contact"
                  className="font-bold text-red-600 underline"
                >
                  write to us
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Getting here , the metro question, answered once. */}

          {/* Hand-off: guidelines read, now go do something. */}
          <section className="reveal mt-6 overflow-hidden rounded-panel bg-ink p-8 text-white md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-[24px] font-extrabold tracking-[-0.03em] md:text-[28px]">
                  {next ? "That's it. Come along." : "That's it."}
                </h2>
                <p className="mt-2.5 max-w-[420px] text-[14.5px] leading-relaxed text-white/60">
                  {next
                    ? `Next one is ${next.when.headline.split(" · ")[0]} at ${VENUE.shortName} · ${priceLabel(next.entryFee)}.`
                    : "The next date isn't up yet. Check back , it's every second Saturday."}
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
