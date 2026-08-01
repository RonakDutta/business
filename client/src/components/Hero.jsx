import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import VideoPlaceholder from "./VideoPlaceholder.jsx";
import { Blobs, PersonTalking } from "./Decor.jsx";
import { ArrowRightIcon, ArrowUpRightIcon, UsersIcon } from "./icons.jsx";
import { stats } from "../data/events.js";

export default function Hero() {
  const { meetupUrl } = useTheme();
  const memberCount = stats[0]?.value ?? 1200;

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-14 pt-6 sm:px-6 sm:pt-8 md:px-10 md:pb-20"
    >
      <div aria-hidden className="hero-glows absolute inset-0 -z-10" />
      <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
      <Blobs className="absolute -left-40 -top-32 -z-10 h-[620px] w-[620px] blur-[6px]" />

      <div className="mx-auto max-w-shell">
        {/* The film leads: full width, wider than tall on big screens so the
            headline underneath is still in view. */}
        <div data-delay="0" className="reveal">
          <VideoPlaceholder aspectClass="aspect-video lg:aspect-[21/9]" />
        </div>

        <div className="mt-10 grid items-center gap-8 sm:mt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <h1
              data-delay="0.06"
              className="reveal text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[46px] md:text-[56px]"
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
              className="reveal mt-5 max-w-[540px] text-[16px] leading-[1.7] text-muted sm:text-[18px]"
            >
              A room full of marketers, founders and freelancers who meet every
              second Saturday to swap what actually worked , and what didn't.
              Watch the two-minute story, then come and see for yourself.
            </p>

            <div
              data-delay="0.18"
              className="reveal mt-8 grid max-w-[420px] grid-cols-1 gap-2.5 sm:flex sm:max-w-none sm:flex-wrap sm:gap-3"
            >
              <a
                href="#events"
                className="inline-flex items-center justify-center gap-2 rounded-btn bg-ink px-6 py-4 text-[15px] font-bold text-white transition-[translate,box-shadow] duration-300 ease-smooth hover:-translate-y-[3px] hover:text-white hover:shadow-[0_10px_20px_-12px_rgba(15,23,42,.5)] sm:px-8"
              >
                Wish to attend
                <ArrowRightIcon className="h-4 w-4" />
              </a>

              <a
                href={meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-btn border border-ink bg-white/70 px-6 py-4 text-[15px] font-bold text-ink backdrop-blur transition-[translate] duration-300 ease-smooth hover:-translate-y-[3px] sm:px-7"
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

          <div data-delay="0.14" className="reveal hidden justify-center lg:flex">
            <PersonTalking className="h-auto w-full max-w-[330px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
