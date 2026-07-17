import { useId } from "react";

/* ===========================================================================
   DECORATIVE VECTORS

   Purely ornamental SVG backdrops — every piece is aria-hidden and
   pointer-events:none, draws in `currentColor`, and is positioned by the
   caller. Nothing here carries meaning for a screen reader; it's atmosphere.

   Each page leans on a different motif so the site doesn't repeat one texture:
     ConnectionMesh  network of nodes      home hero
     Rings           concentric ripples    contact ("reach out")
     Waves           layered sine waves     guidelines hero
     PlusField       tiled plus marks       guidelines / panels
     Scatter         loose dot spray        misc panels
     RoutePath       a dashed winding path  "getting here"
   Colour comes from a `text-*` class on the element, opacity from the shapes,
   so one component re-themes with the accent everywhere it's used.
   =========================================================================== */

/* A network of nodes and links. Hand-placed so it stays balanced rather than
   random. Lines are faint; nodes a touch stronger; a few "hub" nodes ringed. */
export function ConnectionMesh({ className = "" }) {
  const nodes = [
    [60, 70, 5],
    [172, 38, 3.5],
    [250, 118, 7],
    [138, 176, 4.5],
    [44, 232, 3.5],
    [300, 214, 5.5],
    [382, 86, 4.5],
    [468, 158, 6.5],
    [402, 250, 3.5],
    [206, 286, 5],
    [330, 322, 4.5],
    [92, 318, 3.5],
  ];
  const links = [
    [0, 1], [0, 3], [1, 2], [2, 3], [2, 6], [3, 4],
    [2, 5], [5, 6], [6, 7], [5, 8], [7, 8], [5, 9],
    [3, 9], [9, 10], [9, 11], [4, 11], [8, 10], [6, 2],
  ];

  return (
    <svg
      viewBox="0 0 520 360"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.28">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map(([x, y, r], i) => (
          <g key={i}>
            {r >= 6 && (
              <circle cx={x} cy={y} r={r + 5} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
            )}
            <circle cx={x} cy={y} r={r} opacity="0.75" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* Soft organic blobs — the colour-wash behind a section. Two shapes, each its
   own colour via a `style` fill, heavily blurred by the caller. */
export function Blobs({ className = "" }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="var(--b4-accent)"
        opacity="0.10"
        d="M420 120c58 34 104 88 108 152s-34 128-92 168-142 56-208 34-118-82-120-150 44-134 106-176 148-62 206-28z"
      />
      <path
        fill="var(--color-meetup)"
        opacity="0.08"
        d="M180 90c46 8 78 52 96 100s28 104-2 142-96 52-152 36-104-64-108-118 22-118 68-150 54-18 98-10z"
      />
    </svg>
  );
}

/* A single soft accent orb — a lighter-weight backdrop accent than Blobs. */
export function Orb({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="100" fill="currentColor" opacity="0.10" />
    </svg>
  );
}

/* A gentle wave, used as a section divider. Fills with the band colour so it
   blends the tinted events band into the white above and below it. */
export function WaveDivider({ className = "", flip = false }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        fill="currentColor"
        d="M0 40c180-40 360-40 540-14s360 66 540 40 240-46 360-52v66H0z"
      />
    </svg>
  );
}

/* Concentric rings — a "ripple / reach out" motif. Radii step outward and
   fade, so it reads as a signal spreading from a point. */
export function Rings({ className = "", rings = 6 }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" fill="none">
      {Array.from({ length: rings }).map((_, i) => (
        <circle
          key={i}
          cx="120"
          cy="120"
          r={16 + i * 20}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={0.5 - i * 0.06}
        />
      ))}
      <circle cx="120" cy="120" r="6" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/* Layered sine waves — calm, horizontal, good behind a page header. */
export function Waves({ className = "" }) {
  const rows = [40, 78, 116, 154];
  return (
    <svg
      viewBox="0 0 480 200"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {rows.map((y, i) => (
        <path
          key={i}
          d={`M0 ${y} q 40 -22 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`}
          stroke="currentColor"
          strokeWidth="1.4"
          opacity={0.34 - i * 0.05}
        />
      ))}
    </svg>
  );
}

/* A tiled field of small plus marks. Uses a pattern, so the id must be unique
   per instance — useId() handles that when several land on one page. */
export function PlusField({ className = "", gap = 34 }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern
          id={id}
          width={gap}
          height={gap}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${gap / 2} ${gap / 2 - 5}v10M${gap / 2 - 5} ${gap / 2}h10`}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* A loose spray of dots at varied sizes — hand-placed to stay balanced. */
export function Scatter({ className = "" }) {
  const dots = [
    [20, 30, 3], [70, 14, 2], [120, 44, 4], [176, 22, 2.5], [40, 84, 2.5],
    [96, 96, 3.5], [150, 78, 2], [200, 60, 3], [24, 140, 3], [84, 150, 2.5],
    [140, 132, 4], [190, 118, 2.5], [56, 200, 2], [116, 190, 3], [172, 176, 3.5],
  ];
  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={0.4} />
      ))}
    </svg>
  );
}

/* A dashed winding path with waypoints — a light "journey / getting here"
   illustration for the directions block. */
export function RoutePath({ className = "" }) {
  return (
    <svg
      viewBox="0 0 420 140"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M18 112 C 90 30 150 30 210 84 S 340 120 402 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 10"
        opacity="0.5"
      />
      {[
        [18, 112],
        [210, 84],
        [402, 34],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="currentColor" opacity="0.14" />
          <circle cx={x} cy={y} r="3" fill="currentColor" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}
