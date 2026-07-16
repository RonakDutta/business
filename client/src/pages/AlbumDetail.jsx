import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CoverImage from "../components/CoverImage.jsx";
import Lightbox from "../components/Lightbox.jsx";
import NotFound from "./NotFound.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";

export default function AlbumDetail() {
  const { id } = useParams();
  const { getAlbumById } = useEvents();
  const album = getAlbumById(id);
  const [open, setOpen] = useState(null);

  useReveal([id]);

  if (!album) return <NotFound />;

  const total = album.photos.length;
  const prev = () => setOpen((i) => (i - 1 + total) % total);
  const next = () => setOpen((i) => (i + 1) % total);

  return (
    <section className="mx-auto max-w-shell px-6 pb-24 pt-16 md:px-10">
      <Link to="/gallery" className="text-sm font-bold text-accent">
        ← All albums
      </Link>

      <div className="mb-10 mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[12.5px] font-bold tracking-[0.04em] text-subtle">
            {album.date} · {album.place}
          </div>
          <h1 className="mt-2 max-w-[720px] text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
            {album.title}
          </h1>
        </div>

        <Link
          to={`/events/${album.id}`}
          className="accent-border hover:accent-tint whitespace-nowrap rounded-btn border px-5 py-3 text-sm font-bold text-accent transition-[background,translate] duration-300 ease-smooth hover:-translate-y-0.5"
        >
          About this event →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {album.photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            data-stagger
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1} of ${total}`}
            className="reveal aspect-[4/3] overflow-hidden rounded-card transition-[opacity,translate,scale] duration-[450ms] ease-smooth hover:scale-[1.03]"
          >
            <CoverImage
              src={photo.src}
              alt={photo.alt || ""}
              label="PHOTO"
              className="h-full w-full"
            />
          </button>
        ))}
      </div>

      <Lightbox
        photos={album.photos}
        index={open}
        onClose={() => setOpen(null)}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}
