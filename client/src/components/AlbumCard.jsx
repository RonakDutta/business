import { Link } from "react-router-dom";
import CoverImage from "./CoverImage.jsx";

/** Album tile: event cover, with the title over a scrim. Opens the album. */
export default function AlbumCard({ album }) {
  return (
    <Link
      to={`/gallery/${album.id}`}
      data-stagger
      className="reveal clay group relative block aspect-[4/3] overflow-hidden rounded-card transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Cover zooms; the scrim above it does not */}
      <div className="absolute inset-0 transition-[scale] duration-[600ms] ease-smooth group-hover:scale-[1.06]">
        <CoverImage
          src={album.cover}
          alt=""
          label="EVENT PHOTO"
          className="h-full w-full"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.06em] uppercase opacity-80">
          <span>{album.date}</span>
          <span aria-hidden="true">·</span>
          <span>
            {album.count} {album.count === 1 ? "photo" : "photos"}
          </span>
        </div>

        <div className="mt-1.5 text-[18px] font-extrabold leading-snug tracking-[-0.02em]">
          {album.title}
        </div>

        {/* Slides up on hover; always visible to keyboard/touch users */}
        <div className="mt-2 translate-y-1 text-[13px] font-bold opacity-0 transition-[translate,opacity] duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          View album →
        </div>
      </div>
    </Link>
  );
}
