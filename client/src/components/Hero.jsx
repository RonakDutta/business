import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import Carousel from "./Carousel.jsx";
import Stats from "./Stats.jsx";
import AvatarStack from "./AvatarStack.jsx";
import { ConnectionMesh, Blobs } from "./Decor.jsx";
import { CalendarIcon, ArrowRightIcon, ArrowUpRightIcon } from "./icons.jsx";
import { heroSlides, stats, POOL } from "../data/events.js";

export default function Hero() {
  const { meetupUrl } = useTheme();
  const { upcomingEvents } = useEvents();

  // The soonest live meetup drives the "next meetup" chip. Falls back to the
  // static community line when nothing is scheduled. The card date carries the
  // time ("SAT, JUL 18 · 11:00 AM"); the chip only needs the day, so trim it.
  const next = upcomingEvents.find((e) => !e.cancelled);
  const nextDay = next?.date.split(" · ")[0];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-16 pt-14 text-center sm:px-6 sm:pt-[92px] md:px-10 md:pb-20"
    >
      {/* Layered vector backdrop — remove these nodes to revert to plain white. */}
      <div aria-hidden className="hero-glows absolute inset-0 -z-10" />
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
      <Blobs className="absolute -left-40 -top-32 -z-10 h-[620px] w-[620px] blur-[6px]" />
      <ConnectionMesh className="absolute -right-10 top-8 -z-10 hidden h-[360px] w-[520px] text-accent md:block lg:right-4" />

      <div className="mx-auto max-w-shell">
        {next ? (
          <Link
            to={`/events/${encodeURIComponent(next.id)}`}
            data-delay="0"
            className="reveal accent-border group mb-8 inline-flex items-center gap-2 rounded-full border bg-white/70 py-2 pl-3 pr-3.5 text-xs font-bold tracking-[0.04em] text-ink shadow-[0_10px_30px_-24px_rgba(15,23,42,.7)] backdrop-blur transition-transform duration-300 ease-smooth hover:-translate-y-[2px]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/12 text-accent">
              <CalendarIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-accent">NEXT MEETUP</span>
            <span className="text-line-strong">·</span>
            <span className="text-muted">{nextDay}</span>
            <ArrowRightIcon className="h-3.5 w-3.5 text-faint transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div className="reveal accent-border mb-8 inline-flex items-center gap-2 rounded-full border px-[18px] py-2 text-xs font-bold tracking-[0.1em] text-accent">
            A COMMUNITY THAT GROWS TOGETHER
          </div>
        )}

        <h1
          data-delay="0.08"
          className="reveal mx-auto max-w-[860px] text-[36px] font-extrabold leading-[1.03] tracking-[-0.035em] [text-wrap:balance] sm:text-[46px] md:text-[70px]"
        >
          A place to meet, learn, and{" "}
          <span className="relative whitespace-nowrap text-accent">
            grow together
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint sm:-bottom-1.5"
            />
          </span>
          .
        </h1>

        <p
          data-delay="0.16"
          className="reveal mx-auto mt-5 max-w-[580px] text-[16px] leading-[1.65] text-muted [text-wrap:pretty] sm:mt-[26px] sm:text-[18px]"
        >
          Marketers, founders, and freelancers sharing real expertise , because
          we all know something worth teaching.
        </p>

        <div
          data-delay="0.24"
          className="reveal mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3"
        >
          <a
            href="#events"
            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-btn bg-ink px-5 py-4 text-[14px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_8px_16px_-12px_rgba(15,23,42,.4)] sm:px-8 sm:text-[15px]"
          >
            RSVP for the next event
            <ArrowRightIcon className="h-4 w-4" />
          </a>

          <a
            href={meetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-btn bg-meetup px-3 py-4 text-[13px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_8px_18px_-10px_var(--color-meetup)] sm:px-7 sm:text-[15px]"
          >
            Join on Meetup
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>

          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-1.5 rounded-btn border border-line-strong bg-white/60 px-3 py-4 text-[13px] font-bold text-ink backdrop-blur transition-[border-color,translate] duration-300 ease-smooth hover:-translate-y-[3px] hover:border-ink sm:px-[26px] sm:text-[15px]"
          >
            See all events
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div
          data-delay="0.3"
          className="reveal mt-7 flex items-center justify-center gap-3 sm:mt-8"
        >
          <AvatarStack people={POOL} total={stats[0]?.value ?? 1200} max={5} size={30} />
          <p className="text-left text-[13px] leading-tight text-muted">
            <span className="font-bold text-ink">
              {(stats[0]?.value ?? 1200).toLocaleString("en-IN")}+
            </span>{" "}
            members
            <br className="hidden sm:block" />
            <span className="sm:hidden"> · </span>
            already growing together
          </p>
        </div>

        <Carousel slides={heroSlides} />
        <Stats items={stats} />
      </div>
    </section>
  );
}
