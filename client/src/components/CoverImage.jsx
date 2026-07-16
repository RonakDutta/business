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
  const [failed, setFailed] = useState(false);

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
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className} ${imgClassName}`}
    />
  );
}
