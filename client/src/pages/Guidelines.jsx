import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import { VENUE } from "../data/venue.js";
import { priceLabel } from "../lib/format.js";
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

   This is the organising team's page, not an engineering one. The wording is
   a first draft written from what's already on the meetup listing
   (fortnightly, 11 to 1, Gate No. 1, the helpline note). Rewrite it in your
   own words; nothing here is wired to anything.

   The three phases are numbered because they're an actual sequence: before,
   during, after. The house rules aren't a sequence, so they aren't numbered.
   =========================================================================== */

const PHASES = [
  {
    id: "before",
    n: "01",
    title: "Before you come",
    lede: "Ten minutes of admin that saves everyone an awkward start.",
    points: [
      "RSVP on this site or on Meetup so we know how many chairs to put out. The room is a real room, and it fills up.",
      "Pay the entry fee by UPI when you RSVP and keep your payment reference handy.",
      "Come a few minutes early. We start at 11:00 and the intros go first.",
      `Enter via ${VENUE.gate}. The helpline is for finding the gate on the day, not for questions about the meetup.`,
    ],
  },
  {
    id: "in-the-room",
    n: "02",
    title: "In the room",
    lede: "Two hours. No badges, no breakouts, nobody reading slides at you.",
    points: [
      "Everyone introduces themselves: name, what you're building, what you're stuck on. Keep it under a minute.",
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
  "Follow up with people you met. That's the whole point.",
  "Ask questions in the room, not just in the corridor after.",
  "Tell us if something in the session didn't work.",
  "Bring someone who'd get something out of it.",
];

const DONT = [
  "Pitch from the floor or work the room selling.",
  "Add everyone to a mailing list you started on the way home.",
  "Record or stream the session without asking first.",
  "Leave litter. It's a public park and we'd like to stay welcome.",
];

function Rule({ text, allowed }) {
  return (
    <li className="flex gap-3">
      {allowed ? (
        <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
      ) : (
        <CloseIcon className="mt-1 h-4 w-4 shrink-0 text-red-600" />
      )}
      <span className="text-[15.5px] leading-relaxed text-muted">{text}</span>
    </li>
  );
}

export default function Guidelines() {
  const { upcomingEvents } = useEvents();
  const next = upcomingEvents.find((e) => !e.cancelled);

  useReveal([Boolean(next)]);

  const facts = [
    { icon: CalendarIcon, label: "How often", value: "Every second Saturday" },
    { icon: ClockIcon, label: "Hours", value: "11 AM to 1 PM" },
    { icon: TicketIcon, label: "Entry", value: next ? priceLabel(next.entryFee) : "₹150" },
    { icon: MapPinIcon, label: "Door", value: VENUE.gate },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Guidelines" }]}
        title="How a meetup runs"
        lead="Two hours, every two weeks, same room. Here's what to expect and what we expect back. Read it once and you'll walk in like a regular."
      >
        <dl className="reveal card mt-10 grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          {facts.map((f) => (
            <div key={f.label} className="flex items-center gap-3 p-4 sm:p-5">
              <f.icon className="hidden h-5 w-5 shrink-0 text-accent sm:block" />
              <div className="min-w-0">
                <dt className="meta-label">{f.label}</dt>
                <dd className="mt-1 text-[15px] font-semibold text-ink">{f.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section className="section">
        <div className="shell">
          <SectionHeader
            title="Before, during, after"
            lead="What happens on the day, in the order it happens."
          />

          <ol className="mt-10 divide-y divide-line border-y border-line md:mt-12">
            {PHASES.map((phase) => (
              <li
                key={phase.id}
                id={phase.id}
                className="reveal grid scroll-mt-28 gap-6 py-10 lg:grid-cols-[300px_1fr] lg:gap-16"
              >
                <div>
                  <span className="font-display text-[15px] font-semibold text-accent tabular-nums">
                    {phase.n}
                  </span>
                  <h3 className="display-3 mt-2">{phase.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{phase.lede}</p>
                </div>

                <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                  {phase.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[15.5px] leading-[1.65] text-muted">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="house-rules" className="section scroll-mt-20 bg-surface">
        <div className="shell">
          <SectionHeader title="House rules" lead="Short list, seriously meant." />

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2">
            <div className="reveal card p-6 sm:p-8">
              <h3 className="text-[17px] font-semibold">Please do</h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {DO.map((t) => (
                  <Rule key={t} text={t} allowed />
                ))}
              </ul>
            </div>

            <div data-delay="0.06" className="reveal card p-6 sm:p-8">
              <h3 className="text-[17px] font-semibold">Please don't</h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {DONT.map((t) => (
                  <Rule key={t} text={t} allowed={false} />
                ))}
              </ul>
            </div>
          </div>

          {/* The one rule that isn't a matter of taste. */}
          <div className="reveal mt-5 rounded-card border border-red-200 bg-white p-6 sm:p-8">
            <h3 className="text-[17px] font-semibold text-red-700">Zero tolerance for harassment</h3>
            <p className="mt-2 max-w-[75ch] text-[15.5px] leading-relaxed text-muted">
              Harassment of any kind ends your membership. You'll be asked to
              leave and you won't be invited back. No warning, no debate. If
              anything happens in the room, find an organiser. If you'd rather
              not do that in person,{" "}
              <Link to="/contact" className="link">
                write to us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <div className="reveal card flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[560px]">
            <h2 className="display-3">{next ? "That's it. Come along." : "That's it."}</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">
              {next
                ? `The next one is ${next.when.headline.split(" · ")[0]} at ${VENUE.shortName}. Entry is ${priceLabel(next.entryFee)}.`
                : "The next date isn't up yet. It's every second Saturday, so check back soon."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {next && (
              <Link to={`/events/${next.id}`} className="btn btn-primary">
                RSVP
                <ArrowRightIcon />
              </Link>
            )}
            <Link to="/contact" className="btn btn-secondary">
              Ask us something
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
