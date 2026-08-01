import { useRef } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { ArrowRightIcon, ArrowLeftIcon } from "./icons.jsx";
import { testimonials } from "../data/testimonials.js";

// Page 2 of the sketch: a row of quotes that scrolls sideways, each one
// opening its own page.
export default function Testimonials() {
  const trackRef = useRef(null);

  function scrollByCard(direction) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.8), behavior: "smooth" });
  }

  const arrowButton =
    "clay clay-press grid h-10 w-10 place-items-center rounded-full bg-white text-ink disabled:opacity-40";

  return (
    <section className="band-white px-5 py-16 sm:px-6 md:px-10 md:py-24">
      <div className="mx-auto max-w-shell">
        <div className="reveal mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              In their words
            </div>
            <h2 className="text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[38px] md:text-[44px]">
              Testimonials
            </h2>
          </div>

          {/* Sideways arrows: pointless on a phone, where you just swipe. */}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous testimonials"
              className={arrowButton}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="More testimonials"
              className={arrowButton}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="reveal -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((person) => (
            <Link
              key={person.id}
              to={`/testimonials/${person.id}`}
              className="clay clay-press group flex w-[280px] shrink-0 snap-start flex-col justify-between rounded-panel bg-canvas p-6 sm:w-[320px]"
            >
              <p className="text-[15px] leading-[1.7] text-muted">
                “{person.quote}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Avatar person={person} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-bold text-ink">
                    {person.name}
                  </div>
                  <div className="truncate text-[12px] text-subtle">
                    {person.role}
                  </div>
                </div>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-faint transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
