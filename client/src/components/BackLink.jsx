import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "./icons.jsx";

// A plain "back" link with an arrow. `to={-1}` goes back in history.
export default function BackLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted transition-colors duration-200 hover:text-ink ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4 transition-[translate] duration-200 group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
}
