import { MetroIcon, WalkIcon, ExitIcon } from "./icons.jsx";

/**
 * The route from the metro, as a route.
 *
 * Three steps down a connected spine rather than a row in a table , the exit
 * gate is the bit people get wrong, and a table of station names buries it.
 * Reads the `metro` object off a location; renders nothing without one.
 */
export default function MetroRoute({ metro, className = "" }) {
  if (!metro?.station) return null;

  const steps = [
    {
      icon: MetroIcon,
      label: `${metro.station} metro`,
      note: "The nearest metro station for the venue",
    },
    {
      icon: ExitIcon,
      label: `Exit ${metro.exit}`,
      note: "Leave the station here",
    },
    {
      icon: WalkIcon,
      label: metro.walk,
      note: `To ${metro.walkTo}`,
    },
  ];

  return (
    <ol className={`relative flex flex-col gap-5 ${className}`}>
      {/* The spine. Insets so it runs between the icon centres, not past them. */}
      <span
        aria-hidden="true"
        className="absolute left-[17px] top-6 bottom-6 w-px bg-line-strong"
      />

      {steps.map((s) => (
        <li key={s.label} className="relative flex items-center gap-3.5">
          <span className="grid h-[35px] w-[35px] shrink-0 place-items-center rounded-full border border-line bg-white text-accent">
            <s.icon className="h-[17px] w-[17px]" />
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-bold leading-tight text-ink">
              {s.label}
            </div>
            <div className="mt-0.5 text-[12px] text-subtle">{s.note}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
