import { useEffect, useState } from "react";

// Shown while events or photos are loading. The backend sleeps when nobody
// has visited for a while, so after a few seconds we say why it is slow
// instead of leaving people staring at a spinner.
export default function LoadingState({ message = "Loading", className = "" }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center rounded-card border border-line bg-white px-6 py-14 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent"
      />
      <p className="mt-4 text-[15px] font-semibold text-ink">{message}</p>
      {slow && (
        <p className="mt-1.5 max-w-[340px] text-[13.5px] leading-relaxed text-subtle">
          The server takes a moment to wake up after a quiet spell. This can
          take up to a minute on the first visit.
        </p>
      )}
    </div>
  );
}
