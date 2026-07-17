/* ===========================================================================
   DECORATIVE VECTORS

   Purely ornamental SVG backdrops — every piece is aria-hidden and
   pointer-events:none, draws in `currentColor`, and is positioned by the
   caller. Nothing here carries meaning for a screen reader; it's atmosphere.

   The recurring motif is a "connection mesh": nodes joined by lines, a quiet
   nod to a community that networks. Colour comes from a `text-*` class on the
   element, opacity from the shapes themselves, so one component re-themes
   with the accent everywhere it's used.
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
