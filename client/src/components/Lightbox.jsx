import { useCallback, useEffect, useRef } from "react";
import CoverImage from "./CoverImage.jsx";

/**
 * Fullscreen photo viewer. Arrow keys / Esc, click backdrop to close.
 * Locks body scroll while open and restores focus to the trigger on close.
 */
export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);
  const restoreTo = useRef(null);

  const open = index !== null && index >= 0;

  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      restoreTo.current?.focus?.();
    };
  }, [open, onKey]);

  if (!open) return null;

  const photo = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-[scale,background] duration-200 ease-smooth hover:scale-105 hover:bg-white/20"
      >
        ✕
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
        className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white transition-[scale,background] duration-200 ease-smooth hover:scale-105 hover:bg-white/20 md:left-8"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
        className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white transition-[scale,background] duration-200 ease-smooth hover:scale-105 hover:bg-white/20 md:right-8"
      >
        ›
      </button>

      {/* stopPropagation so clicking the photo itself doesn't close */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[82vh] w-full max-w-[1000px] flex-col items-center gap-4"
      >
        <div className="flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-panel bg-white/5">
          <CoverImage
            src={photo.src}
            alt={photo.alt || ""}
            label="PHOTO"
            className="h-full w-full"
            loading="eager"
          />
        </div>

        <figcaption className="font-mono text-xs tracking-[0.08em] text-white/70">
          {index + 1} / {photos.length}
        </figcaption>
      </figure>
    </div>
  );
}
