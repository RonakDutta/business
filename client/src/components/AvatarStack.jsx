import Avatar from "./Avatar.jsx";

/**
 * Overlapping attendee faces with a "+n" cap.
 *
 * `total` is the real number going — `people` is only whoever we have a face
 * for, so the overflow chip counts everyone the stack doesn't show.
 *
 * The white ring sits on a wrapper rather than on <Avatar>: Avatar sets its own
 * ring width, and two ring utilities on one element fight over the same
 * property.
 */
export default function AvatarStack({
  people = [],
  total = 0,
  max = 4,
  size = 28,
  className = "",
}) {
  const shown = people.slice(0, max);
  if (!shown.length) return null;

  const overflow = Math.max(0, total - shown.length);
  const box = { width: size, height: size };

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {shown.map((p) => (
        <span
          key={p.id}
          style={box}
          className="shrink-0 rounded-full bg-white ring-2 ring-white"
        >
          <Avatar person={p} size={size} />
        </span>
      ))}

      {overflow > 0 && (
        <span
          style={box}
          className="grid shrink-0 place-items-center rounded-full bg-line text-[10px] font-bold text-muted ring-2 ring-white"
        >
          +{overflow > 99 ? "99" : overflow}
        </span>
      )}
    </div>
  );
}
