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
      className="mx-auto max-w-shell px-6 pb-16 pt-[88px] text-center md:px-10"
    >
      <div className="reveal accent-border mb-8 inline-flex items-center gap-2 rounded-full border px-[18px] py-2 text-xs font-bold tracking-[0.1em] text-accent">
        A COMMUNITY THAT GROWS TOGETHER
      </div>

      <h1
        data-delay="0.08"
        className="reveal mx-auto max-w-[820px] text-[40px] font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] md:text-[66px]"
      >
        A place to meet, learn, and{" "}
        <span className="text-accent">grow together</span>.
      </h1>

      <p
        data-delay="0.16"
        className="reveal mx-auto mt-[26px] max-w-[560px] text-[18px] leading-[1.65] text-muted [text-wrap:pretty]"
      >
        Marketers, founders, and freelancers sharing real expertise , because we
        all know something worth teaching.
      </p>

      <div
        data-delay="0.24"
        className="reveal mt-10 flex flex-wrap justify-center gap-3"
      >
        <a
          href="#events"
          className="rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_8px_16px_-12px_rgba(15,23,42,.4)]"
        >
          RSVP for the next event
        </a>

        <a
          href={meetupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-btn bg-meetup px-7 py-4 text-[15px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_8px_18px_-10px_var(--color-meetup)]"
        >
          Join on Meetup ↗
        </a>

        <Link
          to="/events"
          className="rounded-btn border border-line-strong px-[30px] py-4 text-[15px] font-bold text-ink transition-[border-color,translate] duration-300 ease-smooth hover:-translate-y-[3px] hover:border-ink"
        >
          See all events
        </Link>
      </div>

      <Carousel slides={heroSlides} />
      <Stats items={stats} />
    </section>
  );
}
