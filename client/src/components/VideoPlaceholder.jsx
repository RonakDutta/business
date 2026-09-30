import { useState } from "react";
import { ConnectionMesh } from "./Decor.jsx";

// The "What is Business 4.0" film. There is no video yet, so this shows a
// branded poster with a play button and says so when you press it. Give it a
// `videoUrl` later and it plays in place; give it a `poster` image and that
// is used instead of the drawn one.
export default function VideoPlaceholder({
  poster = "",
  videoUrl = "",
  label = "Watch: what is Business 4.0",
  aspectClass = "aspect-video",
  fullBleed = false,
}) {
  const shape = fullBleed ? "" : "rounded-panel clay-dark";
  const [playing, setPlaying] = useState(false);
  const [noVideoYet, setNoVideoYet] = useState(false);

  function handlePlay() {
    if (videoUrl) setPlaying(true);
    else setNoVideoYet(true);
  }

  if (playing) {
    return (
      <div className={`relative w-full overflow-hidden bg-ink ${shape} ${aspectClass}`}>
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
      className={`group relative block w-full overflow-hidden bg-ink ${shape} ${aspectClass}`}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover opacity-75 transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.03]"
        />
      ) : (
        // Drawn poster: stays sharp at any width, unlike a stretched photo.
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1f2a4a_0%,#151a2e_45%,#0f1220_100%)]"
        >
          <ConnectionMesh className="absolute -right-8 -top-8 h-[135%] w-[75%] text-white/30" />
          <span className="absolute -bottom-24 -left-20 block h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
          <span className="absolute -right-10 top-1/3 block h-56 w-56 rounded-full bg-meetup/20 blur-3xl" />
        </span>
      )}

      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent"
      />

      <span className="absolute inset-0 grid place-items-center">
        <span className="clay clay-press grid h-16 w-16 place-items-center rounded-full bg-white text-ink group-hover:scale-105 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-9 sm:w-9" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 p-4 text-left sm:p-6">
        <span className="text-[13px] font-bold text-white sm:text-[16px]">
          {noVideoYet ? "The film is on its way , check back soon." : label}
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/80 backdrop-blur">
          {noVideoYet ? "Coming soon" : "2 min"}
        </span>
      </span>
    </button>
  );
}
