import CoverImage from "./CoverImage.jsx";
import { ArrowUpRightIcon } from "./icons.jsx";

/**
 * Portraits sit in a 4/5 frame, desaturated until hover , keeps the row calm
 * when four different photos have four different colour casts.
 */
function TeamMember({ person }) {
  const inner = (
    <>
      <div className="relative overflow-hidden rounded-card border border-line">
        <div className="aspect-[4/5] transition-[scale,filter] duration-[600ms] ease-smooth grayscale-[0.55] group-hover:scale-[1.04] group-hover:grayscale-0">
          <CoverImage
            src={person.image}
            alt={person.name}
            label="PORTRAIT"
            className="h-full w-full"
          />
        </div>

        {/* accent hairline on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-card ring-0 ring-accent transition-all duration-300 group-hover:ring-2" />

        {person.linkedin && (
          <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white/95 text-ink opacity-0 shadow-[0_2px_8px_-2px_rgba(15,23,42,.3)] transition-[translate,opacity] duration-300 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="mt-4 text-[19px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[21px]">
        {person.name}
      </div>
      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.09em] text-accent">
        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
        {person.role}
      </div>
    </>
  );

  const shared = "reveal group block text-left";

  return person.linkedin ? (
    <a
      href={person.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      data-stagger
      className={shared}
    >
      {inner}
    </a>
  ) : (
    <div data-stagger className={shared}>
      {inner}
    </div>
  );
}

export default function Team({ members = [] }) {
  if (!members.length) return null;

  return (
    <section id="team" className="mx-auto max-w-shell px-6 pb-20 md:px-10">
      <div className="reveal mb-10 text-center">
        <h2 className="text-[30px] font-extrabold tracking-[-0.025em] md:text-[38px]">
          Meet the organising team
        </h2>
        <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-accent" />
        <p className="mx-auto mt-5 max-w-[460px] text-[16px] leading-[1.65] text-muted">
          The people who show up early, stack the chairs, and make sure you
          leave knowing someone new.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4">
        {members.map((person) => (
          <TeamMember key={person.id} person={person} />
        ))}
      </div>
    </section>
  );
}
