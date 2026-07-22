/*
  A small, reusable spinner. Inherits colour from `currentColor` (the ring is
  the current text colour with a transparent gap), so it reads correctly on
  any background — white on the ink button, accent on a light panel — just by
  setting the text colour on a parent. Size + thickness via className.
*/
export default function Spinner({ className = "h-5 w-5", label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
