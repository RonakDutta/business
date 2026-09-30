import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import SectionHeader from "./SectionHeader.jsx";
import { ArrowRightIcon } from "./icons.jsx";
import { testimonials } from "../data/testimonials.js";

// Each card leads with what the person got out of the room, then says it in
// their words.
function TestimonialCard({ person, duplicate = false }) {
  return (
    <Link
      to={`/testimonials/${person.id}`}
      tabIndex={duplicate ? -1 : undefined}
      className="card card-hover group flex h-full w-[290px] flex-col p-6 sm:w-[340px] sm:p-7"
    >
      <p className="font-display text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
        {person.outcome}
      </p>

      <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-muted">
        “{person.quote}”
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <Avatar person={person} size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14.5px] font-semibold text-ink">{person.name}</div>
          <div className="truncate text-[13px] text-subtle">{person.role}</div>
        </div>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-faint transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
    </Link>
  );
}

// The row loops forever instead of ending in dead space. The cards are links,
// so it stops the moment you point at it or tab into it.
export default function Testimonials() {
  return (
    <section className="section bg-surface">
      <div className="shell">
        <SectionHeader
          title="What members say"
          lead="What people walked out with. Open any of them for the whole story."
        />
      </div>

      <div className="marquee marquee-mask reveal mt-10 overflow-hidden md:mt-12">
        <ul className="marquee-track">
          {/* The list twice: the second copy is what makes the loop seamless,
              and it is hidden from screen readers and the tab order. */}
          {[...testimonials, ...testimonials].map((person, index) => {
            const duplicate = index >= testimonials.length;
            return (
              <li
                key={`${person.id}-${index}`}
                aria-hidden={duplicate || undefined}
                /* A right margin rather than a gap on the track: every item
                   has to take exactly the same width for the -50% loop to
                   land where the previous copy started. */
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
