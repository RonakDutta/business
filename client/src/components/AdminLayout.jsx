import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Wordmark from "./Wordmark.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowUpRightIcon,
  CloseIcon,
  ImageIcon,
  LayersIcon,
  LogOutIcon,
  MenuIcon,
} from "./icons.jsx";

/* ===========================================================================
   The organiser console.

   Deliberately not the public navbar: this is a workspace, so it gets a rail
   that stays put while a long table scrolls, and an ink surface that makes it
   obvious at a glance you're behind the counter rather than out front.

   "Add meetup" isn't in here. Creating a meetup is an action on the meetups
   page, not a place you navigate to, and it already has a primary button
   there , two doors to one room only makes people wonder what the difference
   is.
   =========================================================================== */

const NAV = [{ label: "Meetups", to: "/admin", end: true, icon: LayersIcon }];

const ELSEWHERE = [
  { label: "Public site", to: "/", icon: ArrowUpRightIcon },
  { label: "Photo gallery", to: "/gallery", icon: ImageIcon },
];

const SectionLabel = ({ children }) => (
  <div className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
    {children}
  </div>
);

const navCls = ({ isActive }) =>
  `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition-colors duration-200 ${
    isActive
      ? "bg-white/[0.09] text-white"
      : "text-white/55 hover:bg-white/5 hover:text-white"
  }`;

function Rail({ user, signOut, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-ink px-4 pb-4 pt-5 text-white">
      <div className="px-2">
        <Link to="/admin" onClick={onNavigate} className="block">
          <Wordmark tone="light" size="sm" />
        </Link>
        <div className="mt-2 pl-[38px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-accent">
          Organiser console
        </div>
      </div>

      <nav className="mt-4 flex-1">
        <SectionLabel>Manage</SectionLabel>
        {NAV.map(({ label, to, end, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            onClick={onNavigate}
            className={navCls}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-4 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent"
                  />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}

        <SectionLabel>Elsewhere</SectionLabel>
        {ELSEWHERE.map(({ label, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-bold text-white/55 transition-colors duration-200 hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="rounded-card bg-white/[0.06] p-3">
        <div className="flex items-center gap-2.5">
          <span className="account-avatar grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white">
            {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-bold text-white">
              {user?.name}
            </div>
            <div className="truncate text-[11px] text-white/45">
              {user?.email}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-btn bg-white/10 py-2 text-[12.5px] font-bold text-white/80 transition-colors duration-200 hover:bg-white/15 hover:text-white"
        >
          <LogOutIcon className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] lg:flex">
      {/* Desktop rail , sticky so the table scrolls under it. */}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 lg:block">
        <Rail user={user} signOut={signOut} />
      </aside>

      {/* Mobile bar + drawer */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-white px-5 py-3 lg:hidden">
        <Link to="/admin">
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
            Organiser
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink"
          >
            <MenuIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
          onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="menu-pop absolute inset-y-0 left-0 w-[264px] origin-left">
            <Rail
              user={user}
              signOut={signOut}
              onNavigate={() => setOpen(false)}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1120px] px-5 py-8 md:px-10 md:py-10">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
