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

// Gallery and Guidelines are reachable from buttons inside the page instead
// of the nav, so the bar stays down to the four things people look for.
const LINKS = [
  { label: "Home", to: "/" },
  { label: "Team", to: "/team" },
  { label: "Events", to: "/events" },
  { label: "Contacts", to: "/contact" },
];

/**
 * Nav items sit in one inset track and the current page is the raised pill.
 * Cheaper to read at a glance than an underline you have to hunt for, and it
 * gives the bar a shape of its own instead of five loose words.
 */
const pill = ({ isActive }) =>
  `rounded-full px-3.5 py-1.5 text-[13.5px] font-bold transition-[color,background,box-shadow] duration-200 ease-smooth ${
    isActive
      ? "bg-white text-ink shadow-[0_1px_2px_rgba(15,23,42,.10),0_4px_10px_-6px_rgba(15,23,42,.30)]"
      : "text-muted hover:text-ink"
  }`;

/* ---------------------------------------------------------------------------
   Signed-in account menu.

   Everything to do with the account lives behind one control, so the bar keeps
   the same shape whether you're logged out, logged in, or an organiser ,
   rather than growing an extra pill per privilege.
   --------------------------------------------------------------------------- */
function AccountMenu({ user, isAdmin, signOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  // A page change should never leave a menu hanging open behind the new page.
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
    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition-colors duration-150";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex h-10 items-center gap-2 rounded-full border p-1 pr-2.5 transition-colors duration-200 ${
          open
            ? "border-transparent bg-line"
            : "border-line-strong hover:border-ink/25 hover:bg-line/60"
        }`}
      >
        <span className="account-avatar grid h-8 w-8 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-24 truncate text-[13px] font-bold text-ink lg:block">
          {user.name}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 text-subtle transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="menu-pop absolute right-0 top-[calc(100%+10px)] w-62 origin-top-right overflow-hidden rounded-card border border-line bg-white shadow-[0_24px_50px_-24px_rgba(15,23,42,.45)]"
        >
          <div className="flex items-center gap-3 border-b border-line p-4">
            <span className="account-avatar grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-bold text-ink">
                {user.name}
              </div>
              <div className="mt-0.5 truncate text-[12px] text-subtle">
                {user.email}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="border-b border-line px-4 py-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.07em] text-accent">
                <ShieldIcon className="h-3 w-3" />
                Organiser
              </span>
            </div>
          )}

          <div className="p-1.5">
            <Link
              to="/events?tab=saved"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`${item} text-muted hover:bg-line hover:text-ink`}
            >
              <HeartIcon className="h-4 w-4" />
              Saved events
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`${item} text-ink hover:bg-line`}
              >
                <ShieldIcon className="h-4 w-4" />
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
              className={`${item} w-full text-muted hover:bg-line hover:text-ink`}
            >
              <LogOutIcon className="h-4 w-4" />
              Log out
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

  // The hairline only earns its keep once there's content behind the bar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/85 backdrop-blur-[14px] transition-[box-shadow,border-radius] duration-300 ${
        open ? "" : "rounded-b-[26px]"
      } ${
        scrolled
          ? "shadow-[0_10px_30px_-20px_rgba(15,23,42,.45)] ring-1 ring-line/70"
          : ""
      }`}
    >
      <nav className="mx-auto flex max-w-shell items-center justify-between gap-4 px-6 py-3.5 md:px-10">
        <Link to="/" aria-label="Business 4.0 , home">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 rounded-full bg-[#f4f5f8] p-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={pill}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <MusicToggle />

          {user ? (
            <AccountMenu user={user} isAdmin={isAdmin} signOut={signOut} />
          ) : (
            <>
              <Link
                to="/login"
                className="flex h-10 items-center rounded-btn px-3 text-sm font-bold text-muted transition-colors duration-200 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex h-10 items-center whitespace-nowrap rounded-btn bg-ink px-5 text-sm font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent hover:text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <MusicToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-ink"
          >
            {open ? (
              <CloseIcon className="h-4.5 w-4.5" />
            ) : (
              <MenuIcon className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="menu-pop absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto rounded-b-[26px] border-t border-line bg-white px-6 pb-6 pt-3 shadow-[0_22px_40px_-24px_rgba(15,23,42,.5)] md:hidden">
          <div className="flex flex-col">
            {LINKS.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-[15px] font-bold transition-colors duration-150 ${
                    isActive ? "bg-line text-ink" : "text-muted"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-line pt-4">
            {user ? (
              <>
                <div className="mb-4 flex items-center gap-3 px-3">
                  <span className="account-avatar grid h-10 w-10 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-bold text-ink">
                      {user.name}
                    </div>
                    <div className="truncate text-[12px] text-subtle">
                      {user.email}
                    </div>
                  </div>
                  {isAdmin && (
                    <span className="ml-auto rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.07em] text-accent">
                      Organiser
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="rounded-btn bg-accent/10 px-5.5 py-2.75 text-center text-sm font-bold text-accent"
                    >
                      Organiser console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                    className="rounded-btn border border-line-strong px-5.5 py-2.75 text-center text-sm font-bold text-muted"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="rounded-btn border border-line-strong px-5.5 py-2.75 text-center text-sm font-bold text-ink"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-btn bg-ink px-5.5 py-2.75 text-center text-sm font-bold text-white"
                >
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
