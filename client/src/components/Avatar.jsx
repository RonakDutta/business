import { useState } from "react";

// Two initials when there is room, one when the circle is small or sits in
// an overlapping stack, where only its left edge shows.
function initials(name = "", single) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return single ? letters.slice(0, 1) : letters;
}

/**
 * A member's photo, or their initials if there is no photo or it fails to
 * load. `ring` marks organisers and Prime members.
 */
export default function Avatar({ person, size = 48, ring = false, stacked = false, className = "" }) {
  const [failed, setFailed] = useState(false);

  const ringCls = ring
    ? "ring-2 ring-accent ring-offset-2 ring-offset-white"
    : "ring-1 ring-line-strong";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-surface-strong ${ringCls} ${className}`}
      style={{ width: size, height: size }}
    >
      {failed || !person.avatar ? (
        <span
          className="flex h-full w-full items-center justify-center font-semibold text-muted"
          style={{ fontSize: Math.max(10, Math.round(size * 0.36)) }}
        >
          {initials(person.name, stacked || size < 30)}
        </span>
      ) : (
        <img
          src={person.avatar}
          alt=""
          loading="lazy"
          width={size}
          height={size}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
