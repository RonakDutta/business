import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CoverImage from "./CoverImage.jsx";
import LoadingState from "./LoadingState.jsx";
import SectionHeader from "./SectionHeader.jsx";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons.jsx";
import { useEvents } from "../context/EventsContext.jsx";

const pad = (n) => String(n).padStart(2, "0");

// Page 3 of the sketch: one photo from a past meetup with its details beside
// it, arrows to step through the other albums, and a way into the gallery.
// It moves on by itself every few seconds, and holds still while the pointer
// or keyboard focus is on it, or when the visitor prefers less motion.
export default function GlimpsesSection({ albums = [] }) {
  const { ready } = useEvents();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const fadeRef = useRef(null);

  const count = albums.length;
  const current = count ? index % count : 0;
  const album = albums[current];
  const photo = album?.photos?.[0];

  const step = useCallback(
    (direction) => {
      if (count <= 1) return;
      setVisible(false);
      clearTimeout(fadeRef.current);
      fadeRef.current = setTimeout(() => {
        setIndex((i) => (i + direction + count) % count);
        setVisible(true);
      }, 200);
    },
    [count],
  );

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (count <= 1 || paused || reduced) return;
    const timer = setInterval(() => step(1), 6000);
    return () => clearInterval(timer);
  }, [count, paused, step]);

  useEffect(() => () => clearTimeout(fadeRef.current), []);

  const fade = `transition-opacity duration-200 ease-smooth ${visible ? "opacity-100" : "opacity-0"}`;

  return (
    <section id="gallery" className="section scroll-mt-20">
      <div className="shell">
        <SectionHeader
          title="Glimpses from past events"
          lead="A few photos from recent Saturdays. Every meetup has its own album."
        />

        <div
          className="reveal mt-10 md:mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {!ready ? (
            <LoadingState message="Loading photos" />
          ) : album ? (
            <div className="card grid overflow-hidden lg:grid-cols-[1.3fr_1fr]">
              <div className="h-64 bg-surface sm:h-80 lg:h-[440px]">
                <Link to={`/gallery/${album.id}`} className={`block h-full ${fade}`} tabIndex={-1} aria-hidden="true">
                  <CoverImage
                    src={photo?.src}
                    alt=""
                    label=""
                    className="h-full w-full"
                  />
                </Link>
              </div>

              <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
                <div className={fade} aria-live="polite">
                  <p className="text-[13.5px] font-semibold text-accent">{album.date}</p>
                  <h3 className="display-3 mt-2">{album.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {album.place} · {album.count} {album.count === 1 ? "photo" : "photos"}
                  </p>
                  <Link to={`/gallery/${album.id}`} className="link-arrow mt-6 text-[15px]">
                    Open this album
                    <ArrowRightIcon />
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
                  <Link to="/gallery" className="btn btn-secondary btn-sm">
                    View the gallery
                  </Link>

                  {count > 1 && (
                    <div className="flex items-center gap-3">
                      <span className="hidden whitespace-nowrap text-[13.5px] font-medium text-subtle tabular-nums sm:inline">
                        {pad(current + 1)} / {pad(count)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => step(-1)}
                          aria-label="Previous event"
                          className="icon-btn icon-btn-outline"
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => step(1)}
                          aria-label="Next event"
                          className="icon-btn icon-btn-outline"
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card px-6 py-14 text-center">
              <p className="text-[17px] font-semibold text-ink">No photos yet</p>
              <p className="mx-auto mt-2 max-w-[320px] text-[14.5px] leading-relaxed text-muted">
                Photos from each meetup go up here a few days after it happens.
              </p>
              <Link to="/gallery" className="btn btn-secondary btn-sm mt-6">
                View the gallery
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
