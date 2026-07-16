import { Link } from "react-router-dom";
import CoverImage from "./CoverImage.jsx";

/** Home-page teaser. The full, event-by-event gallery lives at /gallery. */
export default function GalleryPreview({ photos }) {
  return (
    <section
      id="gallery"
      className="mx-auto max-w-shell px-6 pb-20 text-center md:px-10"
    >
      <h2 className="reveal mb-9 text-[30px] font-extrabold tracking-[-0.025em] md:text-[38px]">
        From our meetups
      </h2>

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
        className="reveal mt-10 inline-flex rounded-btn border border-line-strong px-8 py-4 text-[15px] font-bold text-ink transition-[opacity,border-color,translate] duration-300 ease-smooth hover:-translate-y-[3px] hover:border-ink"
      >
        View all photos
      </Link>
    </section>
  );
}
