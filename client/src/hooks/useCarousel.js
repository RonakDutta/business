import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Auto-advancing carousel with pause-on-hover.
 * Port of the slide state + _timer logic.
 */
export function useCarousel(count, interval = 5000) {
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  const next = useCallback(() => setSlide((s) => (s + 1) % count), [count]);
  const prev = useCallback(() => setSlide((s) => (s - 1 + count) % count), [count]);
  const goTo = useCallback((i) => setSlide(i), []);

  const resume = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setSlide((s) => (s + 1) % count), interval);
  }, [count, interval]);

  const pause = useCallback(() => clearInterval(timer.current), []);

  useEffect(() => {
    resume();
    return () => clearInterval(timer.current);
  }, [resume]);

  return { slide, next, prev, goTo, pause, resume };
}
