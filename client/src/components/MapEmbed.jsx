import { mapEmbedUrl } from "../lib/format.js";

/**
 * Embedded map. Rendered in the detail page body (not the sidebar).
 *
 * Without an API key this uses maps.google.com/?output=embed, which needs no
 * key but is undocumented and can change without notice. Set
 * VITE_GOOGLE_MAPS_API_KEY (see .env.example) to use the official Maps Embed
 * API instead — same component, no other changes.
 *
 * loading="lazy" keeps the iframe off the critical path; it weighs ~800KB.
 */
export default function MapEmbed({ location, title }) {
  const src = mapEmbedUrl(location);
  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-card border border-line">
      <iframe
        src={src}
        title={`Map showing ${title}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-[260px] w-full border-0 grayscale-[0.15] md:h-[320px]"
      />
    </div>
  );
}
