import { useEffect, useRef, useState } from "react";

/**
 * Counts 0 -> `end` with a cubic ease-out once the element scrolls into view.
 * Port of _setupCounters().
 */
export function useCountUp(end, { duration = 1400, threshold = 0.6, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }

    let frame;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);

          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            const raw = end * (1 - Math.pow(1 - p, 3));
            const factor = 10 ** decimals;
            setValue(Math.round(raw * factor) / factor);
            if (p < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        });
      },
      { threshold }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration, threshold, decimals]);

  return [ref, value];
}
