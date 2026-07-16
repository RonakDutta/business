import { useMemo } from "react";
import { encodeQR } from "../lib/qr.js";

/**
 * Renders a QR matrix as one SVG path.
 *
 * Drawn at module scale (1 unit = 1 module) and scaled by the viewBox, so it
 * stays sharp at any size and prints cleanly. `quiet` is the mandatory light
 * margin — the spec asks for 4 modules and scanners really do rely on it.
 *
 * Colour comes from `currentColor`; keep it dark-on-light or scanners struggle.
 */
export default function QRCode({ value, quiet = 4, className = "", title }) {
  const code = useMemo(() => {
    try {
      return encodeQR(value);
    } catch {
      return null;
    }
  }, [value]);

  if (!code) return null;

  const span = code.size + quiet * 2;

  // One path, one fill — cheaper than a few hundred <rect> elements.
  let d = "";
  for (let r = 0; r < code.size; r++) {
    for (let c = 0; c < code.size; c++) {
      if (code.modules[r][c]) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${span} ${span}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label={title || "QR code"}
    >
      <rect width={span} height={span} fill="#fff" />
      <path d={d} fill="currentColor" />
    </svg>
  );
}
