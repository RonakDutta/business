import { useState } from "react";

/**
 * One place that decides image-vs-placeholder. Every image slot in the app
 * (carousel, cards, detail cover, gallery) goes through this, so a missing or
 * broken file degrades to the striped placeholder instead of a broken icon.
 *
 * Pass `src` to show a real photo; omit it to keep the placeholder.
 */
export default function CoverImage({
  src,
  alt = "",
  label = "",
  className = "",
  imgClassName = "",
  loading = "lazy",
}) {
  /*
    Remember WHICH src failed, not just that one did.

    A plain `failed` boolean was sticky: once anything 404'd, this component
    showed the placeholder forever, even after being handed a perfectly good
    new src. That bites on every event page — EventsContext starts on the seed
    records and swaps in the localStorage ones a tick later, so the first paint
    can fail on a missing default and then refuse to draw the real image that
    arrives immediately after. Comparing against the current src means a new
    src is always given its own chance.
  */
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = Boolean(src) && failedSrc === src;

  if (!src || failed) {
    return (
      <div
        className={`placeholder-tile flex items-center justify-center font-mono text-[13px] tracking-[0.05em] text-faint ${className}`}
      >
        {label}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailedSrc(src)}
      className={`h-full w-full object-cover ${className} ${imgClassName}`}
    />
  );
}
