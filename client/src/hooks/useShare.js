import { useCallback, useEffect, useRef, useState } from "react";
import { eventUrl } from "../lib/format.js";

/**
 * Native share sheet on mobile, clipboard fallback everywhere else.
 * Extracted so EventCard and EventActionBar share one implementation.
 * Both APIs require a secure context (https or localhost).
 */
export function useShare(event) {
  const [shared, setShared] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const share = useCallback(async () => {
    const data = {
      title: event.title,
      text: `${event.title} — ${event.date}, ${event.place}`,
      url: eventUrl(event),
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // user dismissed — not an error
      }
    }

    try {
      await navigator.clipboard.writeText(data.url);
      setShared(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setShared(false), 2000);
    } catch {
      /* clipboard blocked (insecure origin) */
    }
  }, [event]);

  return { share, shared };
}
