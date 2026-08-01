import Team from "../components/Team.jsx";
import BackLink from "../components/BackLink.jsx";
import { Orb, Scatter } from "../components/Decor.jsx";
import { UsersIcon } from "../components/icons.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { team } from "../data/team.js";

export default function TeamPage() {
  useReveal([]);

  return (
    <section className="relative isolate mx-auto max-w-shell px-6 pb-10 pt-14 md:px-10">
      <Orb className="pointer-events-none absolute -left-20 -top-8 -z-10 h-56 w-56 text-accent blur-2xl sm:h-64 sm:w-64" />
      <Scatter className="pointer-events-none absolute -right-4 top-4 -z-10 h-36 w-36 text-accent opacity-70 sm:h-52 sm:w-52" />

      <BackLink to="/">Back home</BackLink>

      <div className="reveal mt-7 flex w-fit items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
        <UsersIcon className="h-3.5 w-3.5" />
        The people behind it
      </div>

      <h1
        data-delay="0.06"
        className="reveal mb-3 mt-2.5 text-[36px] font-extrabold tracking-[-0.03em] md:text-[52px]"
      >
        Our{" "}
        <span className="relative whitespace-nowrap text-accent">
          team
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-[0.5em] -z-10 rounded-full accent-tint"
          />
        </span>
      </h1>

      <p
        data-delay="0.12"
        className="reveal mb-4 max-w-[520px] text-[17px] leading-[1.65] text-muted"
      >
        Four of us run Business 4.0 between day jobs. We open the doors, keep
        the sessions on time, and make sure nobody stands in a corner alone.
      </p>

      <Team members={team} />
    </section>
  );
}
