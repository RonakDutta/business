import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import VideoPlaceholder from "./VideoPlaceholder.jsx";
import { Blobs } from "./Decor.jsx";
import {
  CalendarIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  UsersIcon,
} from "./icons.jsx";
import { stats } from "../data/events.js";

export default function Hero() {
  const { meetupUrl } = useTheme();
  const { upcomingEvents } = useEvents();

  const nextEvent = upcomingEvents.find((event) => !event.cancelled);
  const nextEventDay = nextEvent?.date.split(" · ")[0];
  const memberCount = stats[0]?.value ?? 1200;

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-14 pt-10 sm:px-6 sm:pt-16 md:px-10 md:pb-20"
    >
      <div aria-hidden className="hero-glows absolute inset-0 -z-10" />
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
      <Blobs className="absolute -left-40 -top-32 -z-10 h-[620px] w-[620px] blur-[6px]" />

      <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* On phones the words come first, then the film. */}
        <div className="order-1 lg:order-2">
          {nextEvent && (
            <Link
              to={`/events/${encodeURIComponent(nextEvent.id)}`}
              className="reveal accent-border group mb-6 inline-flex items-center gap-2 rounded-full border bg-white/70 py-2 pl-3 pr-3.5 text-xs font-bold tracking-[0.04em] text-ink shadow-[0_10px_30px_-24px_rgba(15,23,42,.7)] backdrop-blur transition-transform duration-300 ease-smooth hover:-translate-y-[2px]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/12 text-accent">
                <CalendarIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-accent">NEXT MEETUP</span>
              <span className="text-line-strong">·</span>
              <span className="text-muted">{nextEventDay}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 text-faint transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
            </Link>
          )}

          <h1
            data-delay="0.06"
            className="reveal text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[44px] md:text-[56px]"
          >
            What is{" "}
            <span className="relative whitespace-nowrap text-accent">
              Business 4.0
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint"
              />
            </span>
            ?
          </h1>

          <p
            data-delay="0.12"
            className="reveal mt-5 max-w-[520px] text-[16px] leading-[1.7] text-muted sm:text-[18px]"
          >
            A room full of marketers, founders and freelancers who meet every
            second Saturday to swap what actually worked , and what didn't.
            Watch the two-minute story, then come and see for yourself.
          </p>

          <div
            data-delay="0.18"
            className="reveal mt-8 grid max-w-[420px] grid-cols-2 gap-2.5 sm:flex sm:max-w-none sm:flex-wrap sm:gap-3"
          >
            <a
              href="#events"
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-btn bg-ink px-6 py-4 text-[15px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_10px_20px_-12px_rgba(15,23,42,.5)] sm:px-8"
            >
              Wish to attend
              <ArrowRightIcon className="h-4 w-4" />
            </a>

            <a
              href={meetupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-btn border border-ink bg-white/70 px-6 py-3.5 text-[14px] font-bold text-ink backdrop-blur transition-[translate] duration-300 ease-smooth hover:-translate-y-[3px] sm:px-7 sm:py-4 sm:text-[15px]"
            >
              Join on Meetup
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </div>

          <div data-delay="0.24" className="reveal mt-7">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/60 px-4 py-2 text-[13px] font-semibold text-muted backdrop-blur">
              <UsersIcon className="h-4 w-4 shrink-0 text-accent" />
              <span>
                <span className="font-bold text-ink">
                  {memberCount.toLocaleString("en-IN")}+
                </span>{" "}
                members already growing together
              </span>
            </div>
          </div>
        </div>

        <div data-delay="0.1" className="reveal order-2 lg:order-1">
          <VideoPlaceholder poster="/images/gallery/2026-06-20/02.jpg" />
        </div>
      </div>
    </section>
  );
}
