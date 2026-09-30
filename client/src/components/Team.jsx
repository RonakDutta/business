import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, LinkedInIcon } from "./icons.jsx";

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// The photo, or a quiet monogram until the photo is added.
function Portrait({ person }) {
  const [failed, setFailed] = useState(false);

  if (!person.image || failed) {
    return (
      <div className="grid h-full w-full place-items-center rounded-card border border-line bg-surface">
        <span className="font-display text-[30px] font-semibold tracking-[-0.02em] text-ink/30 sm:text-[38px]">
          {initials(person.name)}
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

function Member({ person }) {
  return (
    <li data-stagger className="reveal">
      <div className="aspect-square overflow-hidden rounded-card">
        <Portrait person={person} />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-semibold tracking-[-0.01em]">
            {person.name}
          </h3>
          <p className="mt-0.5 text-[14px] text-subtle">{person.role}</p>
        </div>

        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${person.name} on LinkedIn`}
            className="icon-btn icon-btn-outline h-9 w-9"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </li>
  );
}

// The organisers. On the home page it carries its own heading and a link to
// the team page; the team page supplies its own header and hides this one.
export default function Team({ members = [], showHeader = true }) {
  if (!members.length) return null;

  return (
    <div>
      {showHeader && (
        <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 md:mb-12">
          <div className="max-w-[620px]">
            <h2 className="display-2">The organising team</h2>
            <p className="lead mt-4">
              The people who show up early, stack the chairs, and make sure you
              leave knowing someone new.
            </p>
          </div>
          <Link to="/team" className="link-arrow text-[14.5px]">
            About the team
            <ArrowRightIcon />
          </Link>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {members.map((person) => (
          <Member key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
}
