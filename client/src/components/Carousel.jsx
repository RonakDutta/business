import { useCarousel } from "../hooks/useCarousel.js";
import CoverImage from "./CoverImage.jsx";

export default function Carousel({ slides }) {
  const { slide, next, prev, goTo, pause, resume } = useCarousel(slides.length);

  return (
    <div
      className="reveal relative mt-12 overflow-hidden rounded-panel sm:mt-16"
      data-delay="0.3"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div
        className="flex transition-transform duration-[850ms] ease-reveal"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="aspect-[3/2] flex-[0_0_100%] sm:aspect-[2/1] md:aspect-[1.8/1]"
          >
            <CoverImage
              src={s.src}
              alt={s.alt || ""}
              label={s.label}
              className="h-full w-full"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <button
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_6px_18px_-8px_rgba(15,23,42,.45)] transition-transform duration-300 ease-smooth hover:scale-110 sm:left-[18px] sm:h-11 sm:w-11"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 5l-7 7 7 7"
          />
        </svg>
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-[0_6px_18px_-8px_rgba(15,23,42,.45)] transition-transform duration-300 ease-smooth hover:scale-110 sm:right-[18px] sm:h-11 sm:w-11"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 sm:bottom-5 sm:gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === slide}
            onClick={() => goTo(i)}
            className="h-[7px] rounded-full transition-[width,background] duration-300 ease-smooth"
            style={{
              width: i === slide ? 24 : 7,
              background:
                i === slide ? "var(--b4-accent)" : "rgba(255,255,255,.75)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
