import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

/**
 * Scroll-triggered reveal. Any element with `className="reveal"` fades + rises
 * into place once. `data-stagger` offsets siblings inside a grid.
 */
export function useReveal(deps = []) {
  const { motion } = useTheme();

  useEffect(() => {
    const lively = motion !== "Calm";
    const dur = lively ? 0.75 : 0.95;
    const timers = [];

    const root = document.documentElement.style;
    root.setProperty("--reveal-dist", lively ? "26px" : "14px");
    root.setProperty("--reveal-dur", `${dur}s`);

    // Stagger cards that sit in the same grid.
    document.querySelectorAll("[data-stagger]").forEach((el) => {
      const sibs = Array.from(el.parentElement?.children || []).filter((c) =>
        c.hasAttribute("data-stagger"),
      );
      el.dataset.delay = (sibs.indexOf(el) % 3) * 0.1;
    });

    const els = Array.from(
      document.querySelectorAll(".reveal:not(.is-visible)"),
    );

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const delay = Number(el.dataset.delay || 0);

          el.style.transitionDelay = `${delay}s`;
          el.classList.add("is-visible");
          io.unobserve(el);

          const t = setTimeout(
            () => {
              if (el) el.style.transitionDelay = "";
            },
            (delay + dur) * 1000 + 100,
          );
          timers.push(t);
        });
      },
      { threshold: 0.01, rootMargin: "60px 0px 60px 0px" },
    );

    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion, ...deps]);
}
