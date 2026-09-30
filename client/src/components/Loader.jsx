import Spinner from "./Spinner.jsx";
import Wordmark from "./Wordmark.jsx";
import { Orb } from "./Decor.jsx";

/*
  Full-screen branded loader. Shown while the app's data is still loading — on
  first paint, and (once the contexts are wired to the API) while a fetch is in
  flight. Uses the same wordmark, accent and soft-orb language as the rest of
  the site so a load never looks like a blank white flash.
*/
export default function Loader({ label = "Loading" }) {
  return (
    <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-white px-6">
      <Orb className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 text-accent blur-3xl" />

      <div className="flex flex-col items-center gap-6 text-center">
        <div className="animate-pulse">
          <Wordmark />
        </div>
        <div className="text-accent">
          <Spinner className="h-8 w-8 border-[3px]" label={label} />
        </div>
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-subtle">
          {label}
        </p>
      </div>
    </div>
  );
}
