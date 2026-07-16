import { useState } from "react";

const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * Falls back to initials when the avatar API is unreachable , pravatar is a
 * placeholder service and does go down. `ring` marks Prime members.
 */
export default function Avatar({
  person,
  size = 48,
  ring = false,
  className = "",
}) {
  const [failed, setFailed] = useState(false);

  const ringCls = ring
    ? "ring-2 ring-accent ring-offset-2 ring-offset-white"
    : "ring-1 ring-line-strong";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-line ${ringCls} ${className}`}
      style={{ width: size, height: size }}
    >
      {failed ? (
        <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-subtle">
          {initials(person.name)}
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
