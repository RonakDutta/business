import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

/**
 * Scroll-triggered reveal. Any element with `className="reveal"` fades + rises
 * into place once. `data-stagger` offsets siblings inside a grid.
 * Port of _setupReveal() from the original DCLogic class.
 */
export function useReveal(deps = []) {
  const { motion } = useTheme();

  useEffect(() => {
    const lively = motion !== "Calm";
    const dur = lively ? 0.75 : 0.95;

    const root = document.documentElement.style;
    root.setProperty("--reveal-dist", lively ? "26px" : "14px");
    root.setProperty("--reveal-dur", `${dur}s`);

    // Stagger cards that sit in the same grid.
    document.querySelectorAll("[data-stagger]").forEach((el) => {
      const sibs = Array.from(el.parentElement?.children || []).filter((c) =>
        c.hasAttribute("data-stagger")
      );
      el.dataset.delay = (sibs.indexOf(el) % 3) * 0.1;
    });

    const els = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const delay = Number(el.dataset.delay || 0);

          el.style.transitionDelay = `${delay}s`;
          el.classList.add("is-visible");
          io.unobserve(el);

          /*
            Cards share one transition declaration between the reveal and their
            hover lift. If the stagger delay stayed on the element, every later
            hover would wait for it too — so drop it once the reveal is done.
          */
          setTimeout(
            () => {
              el.style.transitionDelay = "";
            },
            (delay + dur) * 1000 + 100
          );
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion, ...deps]);
}
