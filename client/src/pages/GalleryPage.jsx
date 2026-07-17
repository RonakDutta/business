import AlbumCard from "../components/AlbumCard.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import BackLink from "../components/BackLink.jsx";
import { Orb, Scatter } from "../components/Decor.jsx";
import { ImageIcon } from "../components/icons.jsx";

export default function GalleryPage() {
  const { albums } = useEvents();

  useReveal([albums.length]);

  const totalPhotos = albums.reduce((n, a) => n + a.count, 0);

  return (
    <section className="relative isolate mx-auto max-w-shell px-6 pb-24 pt-16 md:px-10">
      {/* Vector backdrop — a loose photo-like scatter + a soft glow. No
          overflow-hidden so nothing clips into a hard edge; kept faint on
          mobile so it never competes with the album covers. */}
      <Orb className="pointer-events-none absolute -left-20 -top-8 -z-10 h-56 w-56 text-accent blur-2xl sm:h-64 sm:w-64" />
      <Scatter className="pointer-events-none absolute -right-4 top-4 -z-10 h-36 w-36 text-accent opacity-70 sm:h-52 sm:w-52 md:right-2" />

      <BackLink to="/">Back home</BackLink>

      <div className="reveal mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
        <ImageIcon className="h-3.5 w-3.5" />
        The archive
      </div>
      <h1 className="mb-3 mt-2.5 text-[36px] font-extrabold tracking-[-0.03em] md:text-[52px]">
        <span className="relative whitespace-nowrap">
          Gallery
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint"
          />
        </span>
      </h1>
      <p className="mb-10 max-w-[520px] text-[17px] leading-[1.65] text-muted">
        {totalPhotos} photos across {albums.length} meetups. Pick an event to see
        the full set.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
}
