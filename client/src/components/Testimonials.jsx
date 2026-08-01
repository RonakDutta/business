import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { ArrowRightIcon, SparkleIcon } from "./icons.jsx";
import { testimonials } from "../data/testimonials.js";

function QuoteMark() {
  return (
    <svg viewBox="0 0 40 28" className="h-6 w-9 text-accent" aria-hidden="true">
      <path
        fill="currentColor"
        opacity="0.28"
        d="M0 28V15.6C0 6.9 4.9 1.7 14.6 0v5.4C9.8 6.6 7.4 9.4 7.4 13.8h6.2V28H0zm22.4 0V15.6C22.4 6.9 27.3 1.7 37 0v5.4c-4.8 1.2-7.2 4-7.2 8.4H36V28H22.4z"
      />
    </svg>
  );
}

function TestimonialCard({ person, duplicate = false }) {
  return (
    <Link
      to={`/testimonials/${person.id}`}
      tabIndex={duplicate ? -1 : undefined}
      className="clay clay-press group flex h-full w-[270px] flex-col rounded-panel bg-canvas p-6 sm:w-[330px]"
    >
      <QuoteMark />

      <p className="mt-4 flex-1 text-[15px] leading-[1.7] text-ink sm:text-[15.5px]">
        {person.quote}
      </p>

      <div className="clay-inset mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-accent">
        <SparkleIcon className="h-3.5 w-3.5" />
        {person.outcome}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-line-strong pt-5">
        <Avatar person={person} size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-bold text-ink">
            {person.name}
          </div>
          <div className="truncate text-[12px] text-subtle">{person.role}</div>
        </div>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-faint transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

// Page 2 of the sketch. The row loops forever rather than ending in dead
// space; the cards are links, so it stops the moment you point at it.
export default function Testimonials() {
  return (
    <section className="band-white py-16 md:py-24">
      <div className="mx-auto max-w-shell px-5 sm:px-6 md:px-10">
        <div className="reveal">
          <div className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            In their words
          </div>

          <h2 className="text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[38px] md:text-[44px]">
            Testimonials
          </h2>

          <p className="mt-4 max-w-[520px] text-[16px] leading-[1.7] text-muted sm:text-[17px]">
            What people walked out with. Tap any of them for the whole story.
          </p>
        </div>
      </div>

      <div className="marquee marquee-mask reveal mt-10 overflow-hidden md:mt-12">
        <ul className="marquee-track">
          {/* The list twice , the second copy is what makes the loop seamless,
              and it is hidden from screen readers and the tab order. */}
          {[...testimonials, ...testimonials].map((person, index) => {
            const duplicate = index >= testimonials.length;
            return (
              <li
                key={`${person.id}-${index}`}
                aria-hidden={duplicate || undefined}
                /* A right margin rather than a gap on the track: every item has
                   to take exactly the same width for the -50% loop to land
                   where the previous copy started. */
                className="mr-5 flex py-2"
              >
                <TestimonialCard person={person} duplicate={duplicate} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
