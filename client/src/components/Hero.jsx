import { useState } from "react";
import VideoPlaceholder from "./VideoPlaceholder.jsx";
import {
  Blobs,
  PersonTalking,
  Squiggle,
  Sparkle,
  CurlyArrow,
} from "./Decor.jsx";
import { ArrowRightIcon } from "./icons.jsx";
import TextType from "./TextType";
import Hyperspeed from "./Hyperspeed.jsx";

const ILLUSTRATION = "/images/illustration/what-is-business-4.png";

function HeroIllustration() {
  const [failed, setFailed] = useState(false);

  if (failed)
    return (
      <PersonTalking className="h-auto w-full max-w-[480px] sm:max-w-[520px]" />
    );

  /* The PNG already carries its own rounded lavender card, so it is not
     wrapped in another white frame. It sits on an offset dotted plate like a
     print pinned to a board, with a few pen doodles around it. */
  return (
    <div className="relative isolate w-full max-w-[560px] px-4 py-6">
      <div
        aria-hidden
        className="pattern-dots clay absolute inset-x-4 inset-y-6 -z-10 translate-x-5 translate-y-5 rotate-[3deg] rounded-[30px]"
      />
      <div className="clay relative -rotate-[1.5deg] overflow-hidden rounded-[28px] bg-[#eef1fe] ring-[6px] ring-white">
        <img
          src={ILLUSTRATION}
          alt="A person at a laptop explaining an idea"
          onError={() => setFailed(true)}
          className="block h-auto w-full scale-[1.025]"
        />
      </div>
      <Sparkle className="bob pointer-events-none absolute -right-1 top-0 h-10 w-10 text-accent [--r:12deg]" />
      <Squiggle className="pointer-events-none absolute -bottom-1 left-10 h-4 w-28 text-accent/45" />
      <CurlyArrow className="pointer-events-none absolute -left-16 top-4 h-16 w-24 -scale-x-100 rotate-[20deg] text-accent/40" />
    </div>
  );
}

const HYPERSPEED_OPTIONS = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [12, 80],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0xf2f5fd,
    islandColor: 0xe2e8f0,
    background: 0xf2f5fd,
    shoulderLines: 0x2563eb,
    brokenLines: 0x3b82f6,
    leftCars: [0x2563eb, 0x3b82f6, 0x60a5fa],
    rightCars: [0x1d4ed8, 0x2563eb, 0x93c5fd],
    sticks: 0x2563eb,
  },
};

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

      <div className="band-white relative overflow-hidden px-5 py-16 sm:px-6 md:px-10 md:py-24">
        {/* Hyperspeed WebGL background canvas layer */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-65">
          <Hyperspeed effectOptions={HYPERSPEED_OPTIONS} />
        </div>
        <div aria-hidden className="hero-grid absolute inset-0 z-0 opacity-40" />
        <div aria-hidden className="hero-glows absolute inset-0 z-0 opacity-60" />
        <Blobs className="pointer-events-none absolute -left-40 -top-24 z-0 h-[560px] w-[560px] blur-[4px]" />

        {/* Grid layout: centered text on mobile (no image), 2-col with illustration on laptop (lg) */}
        <div className="relative z-10 mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1
              data-delay="0.06"
              className="reveal text-[32px] font-extrabold leading-[1.25] tracking-[-0.03em] pb-1 sm:text-[46px] sm:leading-[1.15] md:text-[56px]"
            >
              What is{" "}
              <span className="relative inline-block text-accent">
                <TextType
                  text={["Business 4.0", "Community", "Growth", "Networking"]}
                  typingSpeed={75}
                  deletingSpeed={40}
                  pauseDuration={2200}
                  showCursor={true}
                  cursorCharacter="|"
                  cursorClassName="text-accent font-normal"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0.5 h-[0.35em] -z-10 rounded-full accent-tint"
                />
              </span>
              ?
            </h1>

            <p
              data-delay="0.12"
              className="reveal mt-5 max-w-[540px] text-[16px] leading-[1.7] text-muted sm:text-[18px]"
            >
              A room full of marketers, founders, and freelancers who meet every
              second Saturday to drive real growth, network genuinely, and share what
              actually worked. Watch the story, then come see for yourself.
            </p>

            <a
              href="#about"
              data-delay="0.18"
              className="clay clay-press reveal mt-8 inline-flex items-center justify-center gap-2 rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white hover:text-white"
            >
              Know more
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>

          <div
            data-delay="0.14"
            className="reveal hidden justify-center lg:flex lg:justify-end"
          >
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
