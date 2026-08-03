export function ServerLoader({
  message = "Connecting to server...",
  hint = "Render free instance is waking up — loading events data..."
}) {
  return (
    <div className="clay relative overflow-hidden rounded-panel bg-white p-8 sm:p-10 text-center">
      {/* Background ambient pulse glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-accent/5 via-transparent to-accent/5 animate-pulse" />

      <div className="mx-auto flex flex-col items-center justify-center">
        {/* Animated spinner ring */}
        <div className="relative mb-5 grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
          <svg
            className="h-7 w-7 animate-spin text-accent"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        <h3 className="text-[17px] font-extrabold tracking-[-0.02em] text-ink sm:text-[18px]">
          {message}
        </h3>

        <p className="mt-2 max-w-[340px] text-[13px] leading-relaxed text-muted">
          {hint}
        </p>

        {/* Shimmer skeleton lines */}
        <div className="mt-6 flex w-full max-w-[260px] flex-col gap-2.5">
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-200/80" />
          <div className="h-3 w-3/4 mx-auto animate-pulse rounded-full bg-slate-200/60" />
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="clay relative flex flex-col overflow-hidden rounded-[18px] bg-white p-3 animate-pulse">
      <div className="h-[168px] w-full rounded-[14px] bg-slate-200/80" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-1/3 rounded-full bg-slate-200/80" />
        <div className="h-5 w-3/4 rounded-full bg-slate-200/80" />
        <div className="h-3 w-1/2 rounded-full bg-slate-200/60" />
        <div className="mt-2 h-10 w-full rounded-btn bg-slate-200/80" />
      </div>
    </div>
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="clay relative flex flex-col overflow-hidden rounded-[18px] bg-white p-3 animate-pulse">
      <div className="h-[220px] w-full rounded-[14px] bg-slate-200/80" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="h-4 w-1/4 rounded-full bg-slate-200/80" />
        <div className="h-5 w-2/3 rounded-full bg-slate-200/80" />
      </div>
    </div>
  );
}
