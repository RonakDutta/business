import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Router keeps scroll position across navigations; event detail needs the top.
 *
 * Links that carry a hash (`/guidelines#house-rules` from the footer) want the
 * section, not the top — and because the target only exists after the new page
 * renders, the browser's own anchor handling misses it. This runs late enough
 * to find it.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
