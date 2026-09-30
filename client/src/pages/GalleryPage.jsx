import AlbumCard from "../components/AlbumCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";

export default function GalleryPage() {
  const { albums, ready } = useEvents();

  useReveal([albums.length, ready]);

  const totalPhotos = albums.reduce((n, a) => n + a.count, 0);

  const lead =
    ready && albums.length
      ? `${totalPhotos} photos from ${albums.length} meetups. Pick one to see the full set.`
      : "Photos from every meetup, one album per Saturday.";

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
        title="Gallery"
        lead={lead}
      />

      <section className="shell pb-24 pt-10 md:pt-14">
        {!ready ? (
          <LoadingState message="Loading the gallery" />
        ) : albums.length === 0 ? (
          <div className="rounded-card border border-dashed border-line-strong px-6 py-20 text-center">
            <p className="text-[17px] font-semibold text-ink">No albums yet</p>
            <p className="mx-auto mt-2 max-w-[340px] text-[14.5px] leading-relaxed text-muted">
              Photos from each meetup go up here a few days after it happens.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
