import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

/*
  `overflow-x-clip`, not `overflow-x-hidden`.

  `hidden` computes the other axis to `auto`, which quietly makes this div a
  scroll container , and a sticky child scopes itself to its nearest scroll
  container. The page scrolls on the viewport, this div never scrolls, so the
  navbar had nothing to stick to and rode away with the content.

  `clip` does the same horizontal clipping without creating a scroll container.
  Same fix on `body` in index.css.
*/
export default function Layout() {
  return (
    <div className="overflow-x-clip bg-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
