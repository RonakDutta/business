import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import MusicToggle from "./MusicToggle.jsx";
import Wordmark from "./Wordmark.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ChevronDownIcon,
  CloseIcon,
  HeartIcon,
  LogOutIcon,
  MenuIcon,
  ShieldIcon,
} from "./icons.jsx";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Guidelines", to: "/guidelines" },
  { label: "Events", to: "/events" },
  { label: "Contact", to: "/contact" },
];

const linkClass = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-200 ${
    isActive ? "bg-surface text-ink" : "text-muted hover:text-ink"
  }`;

function initialOf(user) {
  return (user.name || user.email || "?").charAt(0).toUpperCase();
}

// Everything to do with the account sits behind one button, so the bar keeps
// the same shape for visitors, members and organisers.
function AccountMenu({ user, isAdmin, signOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors duration-150";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex h-10 items-center gap-2 rounded-full border bg-white pl-1 pr-3 transition-colors duration-200 ${
          open ? "border-line-strong bg-surface" : "border-line hover:bg-surface"
        }`}
      >
        <span className="account-avatar grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold text-white">
          {initialOf(user)}
        </span>
        <span className="hidden max-w-28 truncate text-[14px] font-medium text-ink lg:block">
          {user.name}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-subtle transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="menu-pop absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-card border border-line bg-white shadow-float"
        >
          <div className="border-b border-line px-4 py-3.5">
            <div className="truncate text-[14px] font-semibold text-ink">{user.name}</div>
            <div className="truncate text-[13px] text-subtle">{user.email}</div>
          </div>

          <div className="p-1.5">
            <Link
              to="/events?tab=saved"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`${item} text-ink hover:bg-surface`}
            >
              <HeartIcon className="h-4 w-4 text-subtle" />
              Saved events
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`${item} text-ink hover:bg-surface`}
              >
                <ShieldIcon className="h-4 w-4 text-subtle" />
                Organiser console
              </Link>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className={`${item} text-ink hover:bg-surface`}
            >
              <LogOutIcon className="h-4 w-4 text-subtle" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // At the top of the page the bar runs full width. Once you scroll it
  // tucks into a floating bar. The header keeps a fixed height either way,
  // so the page underneath never jumps.
  const floating = scrolled && !open;

  return (
    <header className="sticky top-0 z-50 h-16 md:h-[72px]">
      <div
        className={`absolute left-1/2 -translate-x-1/2 transition-[top,width,max-width,border-radius,background-color,box-shadow,border-color] duration-300 ease-smooth ${
          floating
            ? "top-2 w-[calc(100%-1.5rem)] max-w-[1180px] rounded-full border border-line bg-white/90 shadow-float backdrop-blur-md md:top-2.5"
            : "top-0 w-full max-w-[2400px] rounded-none border border-transparent border-b-line bg-white"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-shell items-center justify-between gap-4 transition-[height,padding] duration-300 ease-smooth ${
            floating
              ? "h-14 pl-4 pr-2 md:pl-5"
              : "h-16 px-5 sm:px-6 md:h-[72px] md:px-10"
          }`}
        >
          <Link to="/" aria-label="Business 4.0 home" className="shrink-0">
            <Wordmark />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            <MusicToggle />

            {user ? (
              <AccountMenu user={user} isAdmin={isAdmin} signOut={signOut} />
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <MusicToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="icon-btn text-ink"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="menu-pop absolute inset-x-3 top-[calc(100%+8px)] max-h-[calc(100dvh-88px)] overflow-y-auto rounded-panel border border-line bg-white p-3 shadow-float md:hidden">
          <div className="flex flex-col">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-3 text-[15.5px] font-medium transition-colors duration-150 ${
                    isActive ? "bg-surface text-ink" : "text-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-3 border-t border-line pt-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3.5 py-2">
                  <span className="account-avatar grid h-9 w-9 shrink-0 place-items-center rounded-full text-[14px] font-semibold text-white">
                    {initialOf(user)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-ink">{user.name}</div>
                    <div className="truncate text-[13px] text-subtle">{user.email}</div>
                  </div>
                </div>

                <div className="mt-2 grid gap-2">
                  <Link to="/events?tab=saved" className="btn btn-secondary w-full">
                    Saved events
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="btn btn-secondary w-full">
                      Organiser console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="btn btn-ghost w-full"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="btn btn-secondary w-full">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary w-full">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
