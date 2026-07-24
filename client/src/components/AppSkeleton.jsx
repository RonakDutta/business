import Skeleton from "./Skeleton.jsx";

/*
  Full-page loading skeleton — a grey wireframe of the app shell (navbar, hero,
  a row of cards). Shown by AppGate while the core data loads, which matters
  most when the backend is a cold Render free-tier instance waking from sleep
  (30-60s): a layout-shaped skeleton reads as "loading fast" far better than a
  lone spinner, and the real UI slots straight into the same shape.
*/
export default function AppSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="min-h-[100dvh] bg-white"
    >
      <span className="sr-only">Loading…</span>

      {/* Navbar */}
      <div className="rounded-b-[26px] bg-white/85">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-6 py-3.5 md:px-10">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="hidden gap-2 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="hidden h-9 w-20 rounded-full sm:block" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-shell px-5 pb-14 pt-10 sm:px-6 md:px-10">
        <div className="flex justify-center">
          <Skeleton className="h-9 w-52 rounded-full" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Skeleton className="h-8 w-[85%] max-w-[600px] sm:h-12" />
          <Skeleton className="h-8 w-[62%] max-w-[440px] sm:h-12" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-[72%] max-w-[480px]" />
          <Skeleton className="h-4 w-[52%] max-w-[360px]" />
        </div>

        {/* CTAs — same mobile shape as the real hero */}
        <div className="mx-auto mt-9 grid max-w-[400px] grid-cols-2 gap-2.5 sm:flex sm:max-w-none sm:justify-center sm:gap-3">
          <Skeleton className="col-span-2 h-14 w-full rounded-full sm:w-56" />
          <Skeleton className="h-12 w-full rounded-full sm:w-40" />
          <Skeleton className="h-12 w-full rounded-full sm:w-40" />
        </div>

        {/* Cover / carousel band */}
        <Skeleton className="mt-12 aspect-[3/2] w-full rounded-panel sm:aspect-[2/1] md:aspect-[1.8/1]" />
      </div>

      {/* A row of card placeholders */}
      <div className="mx-auto max-w-shell px-6 pb-20 md:px-10">
        <Skeleton className="mb-7 h-7 w-44" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-card border border-line"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="flex flex-col gap-2.5 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-2 h-9 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
