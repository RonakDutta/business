import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import Carousel from "./Carousel.jsx";
import Stats from "./Stats.jsx";
import { heroSlides, stats } from "../data/events.js";

export default function Hero() {
  const { meetupUrl } = useTheme();

  return (
    <section
      id="top"
      className="mx-auto max-w-shell px-5 pb-14 pt-14 text-center sm:px-6 sm:pt-[88px] md:px-10 md:pb-16"
    >
      <div className="reveal accent-border mb-8 inline-flex items-center gap-2 rounded-full border px-[18px] py-2 text-xs font-bold tracking-[0.1em] text-accent">
        A COMMUNITY THAT GROWS TOGETHER
      </div>

      <h1
        data-delay="0.08"
        className="reveal mx-auto max-w-[820px] text-[34px] font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-[40px] md:text-[66px]"
      >
        A place to meet, learn, and{" "}
        <span className="text-accent">grow together</span>.
      </h1>

      <p
        data-delay="0.16"
        className="reveal mx-auto mt-5 max-w-[560px] text-[16px] leading-[1.65] text-muted [text-wrap:pretty] sm:mt-[26px] sm:text-[18px]"
      >
        Marketers, founders, and freelancers sharing real expertise , because we
        all know something worth teaching.
      </p>

      <div
        data-delay="0.24"
        className="reveal mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3"
      >
        <a
          href="#events"
          className="col-span-2 flex items-center justify-center rounded-btn bg-ink px-5 py-4 text-[14px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_8px_16px_-12px_rgba(15,23,42,.4)] sm:inline-flex sm:px-8 sm:text-[15px]"
        >
          RSVP for the next event
        </a>

        <a
          href={meetupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-btn bg-meetup px-3 py-4 text-[13px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_8px_18px_-10px_var(--color-meetup)] sm:gap-2 sm:px-7 sm:text-[15px]"
        >
          Join on Meetup ↗
        </a>

        <Link
          to="/events"
          className="flex items-center justify-center rounded-btn border border-line-strong px-3 py-4 text-[13px] font-bold text-ink transition-[border-color,translate] duration-300 ease-smooth hover:-translate-y-[3px] hover:border-ink sm:inline-flex sm:px-[30px] sm:text-[15px]"
        >
          See all events
        </Link>
      </div>

      <Carousel slides={heroSlides} />
      <Stats items={stats} />
    </section>
  );
}
