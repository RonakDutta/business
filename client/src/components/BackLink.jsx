import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "./icons.jsx";

/**
 * The "← All events" links were bare text, which made the most-used control on
 * every subpage the least visible thing on it. This is the same link with a
 * hit area: a pill, with the arrow nudging left on hover to say which way it
 * goes.
 *
 * `transition-[translate]`, not `transition-transform` , v4 compiles
 * -translate-x-* to `translate:`, so a transform transition would never fire.
 */
export default function BackLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white py-1.5 pl-1.5 pr-4 text-[13px] font-bold text-muted transition-colors duration-200 hover:border-ink/25 hover:text-ink ${className}`}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-line text-subtle transition-[translate,background,color] duration-300 ease-smooth group-hover:-translate-x-0.5 group-hover:bg-ink group-hover:text-white">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
      </span>
      {children}
    </Link>
  );
}
