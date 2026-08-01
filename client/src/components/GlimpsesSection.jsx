import { useState } from "react";
import { Link } from "react-router-dom";
import CoverImage from "./CoverImage.jsx";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons.jsx";

// Page 3 of the sketch: one wide photo from a past meetup with the details
// beside it, and arrows to step through the other albums. Runs edge to edge,
// like the hero video.
export default function GlimpsesSection({ albums = [] }) {
  const [index, setIndex] = useState(0);

  const album = albums[index];
  const photo = album?.photos?.[0];

  function step(direction) {
    setIndex((current) => (current + direction + albums.length) % albums.length);
  }

  const arrowButton =
    "clay clay-press grid h-11 w-11 place-items-center rounded-full bg-white text-ink";

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="mx-auto max-w-shell px-5 sm:px-6 md:px-10">
        <div className="reveal">
          <div className="text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
            Glimpses
          </div>
          <h2 className="mt-3 text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[38px] md:text-[44px]">
            From the past events
          </h2>
        </div>
      </div>

      <div className="reveal clay mt-9 bg-white md:mt-12">
        {album ? (
          <div className="grid items-stretch lg:grid-cols-2">
            <div className="h-[260px] sm:h-[380px] lg:h-[520px]">
              <CoverImage
                src={photo?.src}
                alt={photo?.alt || `Photo from ${album.title}`}
                label="MEETUP PHOTO"
              />
            </div>

            <div className="flex w-full max-w-[560px] flex-col justify-center gap-6 px-5 py-10 sm:px-8 sm:py-14 md:px-12 lg:px-16">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.11em] text-subtle">
                  {album.date}
                </div>
                <h3 className="mt-3 text-[24px] font-extrabold leading-[1.2] tracking-[-0.025em] sm:text-[30px]">
                  {album.title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-muted sm:text-[16px]">
                  {album.place} · {album.count}{" "}
                  {album.count === 1 ? "photo" : "photos"} from the day.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/gallery"
                  className="clay clay-press rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white hover:text-white"
                >
                  Gallery
                </Link>

                {albums.length > 1 && (
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous event"
                      className={arrowButton}
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next event"
                      className={arrowButton}
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-16 text-center sm:px-6 md:px-10">
            <p className="text-[16px] text-muted">
              Photos from the meetups will show up here.
            </p>
            <Link
              to="/gallery"
              className="clay clay-press mt-6 inline-block rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white hover:text-white"
            >
              Gallery
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
