import { Link } from "react-router-dom";
import CoverImage from "./CoverImage.jsx";
import { ArrowRightIcon } from "./icons.jsx";

/** One meetup's album: the cover photo, then the date, count and title. */
export default function AlbumCard({ album }) {
  return (
    <Link
      to={`/gallery/${album.id}`}
      data-stagger
      className="reveal card card-hover group flex flex-col overflow-hidden"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface">
        <CoverImage
          src={album.cover}
          alt=""
          className="h-full w-full transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[13.5px] text-subtle">
          {album.date} · {album.count} {album.count === 1 ? "photo" : "photos"}
        </p>
        <h2 className="mt-1.5 text-[18px] font-semibold leading-snug tracking-[-0.01em]">
          {album.title}
        </h2>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14.5px] font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
          View album
          <ArrowRightIcon className="h-4 w-4 transition-[translate] duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
