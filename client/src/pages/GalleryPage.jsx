import AlbumCard from "../components/AlbumCard.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import BackLink from "../components/BackLink.jsx";

export default function GalleryPage() {
  const { albums } = useEvents();

  useReveal([albums.length]);

  const totalPhotos = albums.reduce((n, a) => n + a.count, 0);

  return (
    <section className="mx-auto max-w-shell px-6 pb-24 pt-16 md:px-10">
      <BackLink to="/">Back home</BackLink>

      <h1 className="mb-3 mt-6 text-[36px] font-extrabold tracking-[-0.03em] md:text-[52px]">
        Gallery
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
