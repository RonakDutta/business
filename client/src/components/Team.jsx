import { useState } from "react";
import { ArrowUpRightIcon, UsersIcon } from "./icons.jsx";

/**
 * Helper to get initials from full name
 */
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TeamPortrait({ person }) {
  const [failed, setFailed] = useState(false);

  if (!person.image || failed) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-[#1e293b] to-accent/80 p-4 text-white">
        {/* Soft decorative background shapes */}
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5 blur-xs"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full border border-white/10"
        />

        <span className="relative grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/10 text-[26px] font-extrabold tracking-[-0.03em] text-white shadow-inner backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          {initials(person.name)}
        </span>
        <span className="relative mt-4 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 backdrop-blur-xs">
          Business 4.0
        </span>
      </div>
    );
  }

  return (
    <img
      src={person.image}
      alt={person.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

function TeamMember({ person }) {
  const inner = (
    <div className="clay clay-squish group relative flex flex-col overflow-hidden rounded-[20px] bg-white isolate">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900 isolate">
        <div className="h-full w-full">
          <TeamPortrait person={person} />
        </div>
        {person.linkedin && (
          <span className="absolute right-3 top-3 z-10 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md backdrop-blur-xs transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white hover:text-accent">
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="flex flex-col items-center p-5 text-center">
        <h3 className="text-[19px] font-extrabold tracking-[-0.02em] text-ink sm:text-[20px]">
          {person.name}
        </h3>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.09em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {person.role}
        </div>
      </div>
    </div>
  );

  return person.linkedin ? (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      data-stagger
      className="reveal block text-left"
    >
      {inner}
    </a>
  ) : (
    <div data-stagger className="reveal block text-left">
      {inner}
    </div>
  );
}

export default function Team({ members = [], showHeader = true }) {
  if (!members.length) return null;

  return (
    <section id="team" className="relative mx-auto w-full">
      {showHeader && (
        <div className="reveal mb-10 text-center">
          <div className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
            <UsersIcon className="h-3.5 w-3.5" />
            The organisers
          </div>
          <h2 className="text-[30px] font-extrabold tracking-[-0.025em] md:text-[38px]">
            Meet the organising team
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-accent" />
          <p className="mx-auto mt-5 max-w-[460px] text-[16px] leading-[1.65] text-muted">
            The people who show up early, stack the chairs, and make sure you
            leave knowing someone new.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((person) => (
          <TeamMember key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}
