// A small rotating ring. It takes its colour from the text colour of its
// parent, so it works on a dark button and on a white panel alike.
export default function Spinner({ className = "h-5 w-5", label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}
