import { useState } from "react";

const POSTER = "/images/hero/hero3.jpg";

// The "What is Business 4.0" film. There is no video yet, so this shows a
// photo from a meetup with a play button, and says so when you press it.
// Give it a `videoUrl` (an embed link) later and it plays in place.
export default function VideoPlaceholder({
  poster = POSTER,
  videoUrl = "",
  label = "The story of Business 4.0",
  className = "",
}) {
  const [playing, setPlaying] = useState(false);
  const [noVideoYet, setNoVideoYet] = useState(false);

  function handlePlay() {
    if (videoUrl) setPlaying(true);
    else setNoVideoYet(true);
  }

  if (playing) {
    return (
      <div className={`relative w-full overflow-hidden bg-black ${className}`}>
        <iframe
          src={videoUrl}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Play: ${label}`}
      className={`group relative block w-full overflow-hidden bg-ink text-left ${className}`}
    >
      <img
        src={poster}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_62%] transition-transform duration-700 ease-smooth group-hover:scale-[1.015]"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5"
      />

      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-ink shadow-float transition-transform duration-300 ease-smooth group-hover:scale-105 sm:h-20 sm:w-20">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor">
            <path d="M8.5 5.5v13l11-6.5z" />
          </svg>
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 block">
        <span className="shell flex items-end justify-between gap-4 pb-5 sm:pb-8">
          <span className="block">
            <span className="block font-display text-[16px] font-semibold text-white sm:text-[20px]">
              {noVideoYet ? "The film is on its way" : label}
            </span>
            <span className="mt-1 block text-[13px] text-white/75 sm:text-[14.5px]">
              {noVideoYet
                ? "Check back soon, or come and see the room for yourself."
                : "A two-minute film about the room"}
            </span>
          </span>
          <span className="hidden rounded-full bg-white/15 px-3 py-1 text-[12.5px] font-semibold text-white backdrop-blur-sm sm:inline-block">
            {noVideoYet ? "Coming soon" : "2 min"}
          </span>
        </span>
      </span>
    </button>
  );
}
