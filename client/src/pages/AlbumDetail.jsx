import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CoverImage from "../components/CoverImage.jsx";
import Lightbox from "../components/Lightbox.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import NotFound from "./NotFound.jsx";
import { ArrowRightIcon } from "../components/icons.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";

export default function AlbumDetail() {
  const { id } = useParams();
  const { getAlbumById, ready } = useEvents();
  const album = getAlbumById(id);
  const [open, setOpen] = useState(null);

  useReveal([id, Boolean(album)]);

  // Albums come from the server; don't call it missing before it has loaded.
  if (!album) {
    return ready ? (
      <NotFound />
    ) : (
      <div className="shell py-16">
        <LoadingState message="Loading the album" />
      </div>
    );
  }

  const total = album.photos.length;
  const prev = () => setOpen((i) => (i - 1 + total) % total);
  const next = () => setOpen((i) => (i + 1) % total);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Gallery", to: "/gallery" },
          { label: album.title },
        ]}
        title={album.title}
        lead={`${album.date} · ${album.place}`}
        actions={
          <Link to={`/events/${album.id}`} className="btn btn-secondary">
            About this event
            <ArrowRightIcon />
          </Link>
        }
      />

      <section className="shell pb-24 pt-10 md:pt-14">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {album.photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              data-stagger
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1} of ${total}`}
              className="reveal group aspect-[4/3] overflow-hidden rounded-card bg-surface"
            >
              <CoverImage
                src={photo.src}
                alt={photo.alt || ""}
                className="h-full w-full transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </section>

      <Lightbox
        photos={album.photos}
        index={open}
        onClose={() => setOpen(null)}
        onPrev={prev}
        onNext={next}
      />
    </>
  );
}
