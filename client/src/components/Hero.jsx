import VideoPlaceholder from "./VideoPlaceholder.jsx";
import { ArrowRightIcon, MapPinIcon } from "./icons.jsx";
import { VENUE } from "../data/venue.js";

// Page 1 of the sketch: the film first, full width, then what Business 4.0 is
// with a photo of the room beside it.
export default function Hero() {
  return (
    <section id="top">
      <VideoPlaceholder className="aspect-[4/3] sm:aspect-video lg:aspect-auto lg:h-[min(calc(100svh-72px),760px)]" />

      <div className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div className="text-center lg:text-left">
            <p className="reveal kicker">Every second Saturday in New Delhi</p>

            <h1 data-delay="0.04" className="reveal display-1 mt-4">
              What is Business 4.0?
            </h1>

            <p
              data-delay="0.08"
              className="reveal lead mx-auto mt-5 max-w-[560px] lg:mx-0"
            >
              A room full of marketers, founders, and freelancers who meet every
              second Saturday to drive real growth, network genuinely, and share
              what actually worked. Watch the story, then come see for yourself.
            </p>

            <div
              data-delay="0.12"
              className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <a href="#about" className="btn btn-primary btn-lg w-full sm:w-auto">
                Know more
              </a>
              <a href="#events" className="btn btn-secondary btn-lg w-full sm:w-auto">
                See the next meetup
                <ArrowRightIcon />
              </a>
            </div>
          </div>

          <figure data-delay="0.1" className="reveal relative mx-auto hidden w-full max-w-[580px] pb-6 lg:block">
            <div className="overflow-hidden rounded-panel bg-surface">
              <img
                src="/images/hero/hero2.jpg"
                alt="Members of Business 4.0 together at Project Otenga"
                loading="lazy"
                className="aspect-[5/4] w-full object-cover object-[50%_42%]"
              />
            </div>

            <figcaption className="absolute bottom-0 left-6 flex items-center gap-3 rounded-card border border-line bg-white py-3 pl-3 pr-5 shadow-lift">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-accent">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <span className="block">
                <span className="block text-[14.5px] font-semibold text-ink">
                  {VENUE.shortName}, Shaheedi Park
                </span>
                <span className="block text-[13px] text-subtle">
                  Saturdays, 11 AM to 1 PM
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
