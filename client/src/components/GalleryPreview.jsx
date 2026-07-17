import { Link } from "react-router-dom";
import CoverImage from "./CoverImage.jsx";
import { Orb } from "./Decor.jsx";
import { ImageIcon, ArrowRightIcon } from "./icons.jsx";

/** Home-page teaser. The full, event-by-event gallery lives at /gallery. */
export default function GalleryPreview({ photos }) {
  return (
    <section
      id="gallery"
      className="relative mx-auto max-w-shell overflow-hidden px-6 pb-24 text-center md:px-10"
    >
      <Orb className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 text-accent blur-2xl" />

      <div className="reveal mb-9">
        <div className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
          <ImageIcon className="h-3.5 w-3.5" />
          Moments
        </div>
        <h2 className="text-[30px] font-extrabold tracking-[-0.025em] md:text-[38px]">
          From our meetups
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((p) => (
          <div
            key={p.id}
            data-stagger
            className="reveal aspect-[4/3] overflow-hidden rounded-card transition-[opacity,translate,scale] duration-[450ms] ease-smooth hover:scale-[1.025]"
          >
            <CoverImage
              src={p.src}
              alt={p.alt || ""}
              label="PHOTO"
              className="h-full w-full"
            />
          </div>
        ))}
      </div>

      <Link
        to="/gallery"
        className="reveal group mt-10 inline-flex items-center gap-2 rounded-btn border border-line-strong px-8 py-4 text-[15px] font-bold text-ink transition-[opacity,border-color,translate] duration-300 ease-smooth hover:-translate-y-[3px] hover:border-ink"
      >
        View all photos
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
