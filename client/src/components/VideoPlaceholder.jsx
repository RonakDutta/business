import { useState } from "react";

// The "What is Business 4.0" film. There is no video yet, so this shows a
// poster with a play button and says so when you press it. When the film
// exists, pass its embed url as `videoUrl` and it plays in place.
export default function VideoPlaceholder({
  poster = "/images/hero/hero1.jpg",
  videoUrl = "",
  label = "Watch: what is Business 4.0",
}) {
  const [playing, setPlaying] = useState(false);
  const [noVideoYet, setNoVideoYet] = useState(false);

  function handlePlay() {
    if (videoUrl) setPlaying(true);
    else setNoVideoYet(true);
  }

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-panel bg-ink">
        <iframe
          src={videoUrl}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={label}
      className="group relative block aspect-video w-full overflow-hidden rounded-panel bg-ink shadow-[0_30px_60px_-40px_rgba(15,23,42,.7)]"
    >
      <img
        src={poster}
        alt=""
        className="h-full w-full object-cover opacity-80 transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.03]"
      />

      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
      />

      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-ink shadow-[0_10px_30px_-8px_rgba(15,23,42,.6)] transition-transform duration-300 ease-smooth group-hover:scale-110 sm:h-20 sm:w-20">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 sm:h-8 sm:w-8" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 p-4 text-left sm:p-5">
        <span className="text-[13px] font-bold text-white sm:text-[15px]">
          {noVideoYet ? "The film is on its way , check back soon." : label}
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/80 backdrop-blur">
          {noVideoYet ? "Coming soon" : "2 min"}
        </span>
      </span>
    </button>
  );
}
