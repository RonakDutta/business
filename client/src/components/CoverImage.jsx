import { useState } from "react";

/**
 * One place that decides image-vs-placeholder. Every image slot in the app
 * (cards, detail cover, gallery) goes through this, so a missing or broken
 * file degrades to a quiet grey tile instead of a broken image icon.
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
    Remember WHICH src failed, not just that one did. A plain `failed` boolean
    was sticky: once anything 404'd, this showed the placeholder forever, even
    after being handed a perfectly good new src. Comparing against the current
    src means a new src always gets its own chance.
  */
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = Boolean(src) && failedSrc === src;

  if (!src || failed) {
    return (
      <div
        className={`placeholder-tile flex items-center justify-center px-4 text-center text-[13px] text-subtle ${className}`}
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
