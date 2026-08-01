import { useState } from "react";
import VideoPlaceholder from "./VideoPlaceholder.jsx";
import { Blobs, PersonTalking } from "./Decor.jsx";
import { ArrowRightIcon } from "./icons.jsx";

const ILLUSTRATION = "/images/illustration/what-is-business-4.png";

// Falls back to the drawn vector until the artwork is added, so a missing
// file never leaves a hole in the page.
function HeroIllustration() {
  const [failed, setFailed] = useState(false);

  if (failed) return <PersonTalking className="h-auto w-full max-w-[360px]" />;

  return (
    <img
      src={ILLUSTRATION}
      alt=""
      onError={() => setFailed(true)}
      className="h-auto w-full max-w-[420px]"
    />
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative isolate">
      {/* The film runs edge to edge, with no rounding and nothing beside it. */}
      <div className="reveal" data-delay="0">
        <VideoPlaceholder
          aspectClass="aspect-video lg:aspect-[23/10]"
          fullBleed
        />
      </div>

      <div className="relative overflow-hidden px-5 py-14 sm:px-6 md:px-10 md:py-20">
        <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
        <Blobs className="absolute -left-40 -top-24 -z-10 h-[560px] w-[560px] blur-[6px]" />

        <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
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

            <a
              href="#events"
              data-delay="0.18"
              className="clay clay-press reveal mt-8 inline-flex items-center justify-center gap-2 rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white hover:text-white"
            >
              Know more
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          <div
            data-delay="0.14"
            className="reveal flex justify-center lg:justify-end"
          >
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
