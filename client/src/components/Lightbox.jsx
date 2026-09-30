import { useCallback, useEffect, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "./icons.jsx";

/**
 * Fullscreen photo viewer. Arrow keys and Esc work, clicking the backdrop
 * closes it. Locks page scroll while open and gives focus back to the photo
 * you opened when it closes.
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
    [onClose, onPrev, onNext],
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
  const control =
    "grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`${control} absolute right-4 top-4`}
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo"
            className={`${control} absolute left-3 top-1/2 -translate-y-1/2 md:left-8`}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo"
            className={`${control} absolute right-3 top-1/2 -translate-y-1/2 md:right-8`}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </>
      )}

      {/* stopPropagation so clicking the photo itself doesn't close it */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[1100px] flex-col items-center gap-4"
      >
        <img
          src={photo.src}
          alt={photo.alt || ""}
          className="max-h-[80vh] w-auto max-w-full rounded-card object-contain"
        />
        <figcaption className="text-[13px] tabular-nums text-white/70">
          {index + 1} / {photos.length}
        </figcaption>
      </figure>
    </div>
  );
}
