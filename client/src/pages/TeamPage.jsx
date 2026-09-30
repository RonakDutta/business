import { Link } from "react-router-dom";
import Team from "../components/Team.jsx";
import BackLink from "../components/BackLink.jsx";
import { Orb, Scatter } from "../components/Decor.jsx";
import { UsersIcon, ArrowRightIcon } from "../components/icons.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { team } from "../data/team.js";



export default function TeamPage() {
  useReveal([]);

  return (
    <div className="relative isolate min-h-screen">
      {/* Background Ambient Decor */}
      <Orb className="pointer-events-none absolute -left-20 top-12 -z-10 h-72 w-72 text-accent blur-3xl opacity-60" />
      <Scatter className="pointer-events-none absolute -right-6 top-24 -z-10 h-48 w-48 text-accent opacity-50" />

      <main className="mx-auto max-w-shell px-5 pb-20 pt-10 sm:px-6 md:px-10">
        <BackLink to="/">Back home</BackLink>

        {/* Hero Section */}
        <header className="mt-8 mb-12 max-w-[680px]">
          <div className="reveal inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
            <UsersIcon className="h-3.5 w-3.5" />
            The people behind it
          </div>

          <h1
            data-delay="0.06"
            className="reveal mt-3 text-[36px] font-extrabold tracking-[-0.03em] sm:text-[46px] md:text-[56px]"
          >
            Meet our{" "}
            <span className="relative whitespace-nowrap text-accent">
              organisers
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-[0.4em] -z-10 rounded-full accent-tint"
              />
            </span>
          </h1>

          <p
            data-delay="0.12"
            className="reveal mt-4 text-[17px] leading-[1.7] text-muted sm:text-[18px]"
          >
            Four of us run Business 4.0 between day jobs. We open the doors, keep
            the sessions on time, and make sure nobody stands in a corner alone.
          </p>
        </header>

        {/* Team Members Grid */}
        <section className="reveal mb-16" data-delay="0.16">
          <Team members={team} showHeader={false} />
        </section>

        {/* Call To Action Box */}
        <section className="reveal text-center rounded-[24px] bg-ink px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16" data-delay="0.24">
          <h2 className="text-[28px] font-extrabold tracking-[-0.025em] sm:text-[36px]">
            Want to get in touch with the team?
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[16px] text-white/70">
            Have questions about upcoming meetups, partnerships, or speaking at an edition? Reach out to us.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="clay clay-press inline-flex items-center gap-2 rounded-btn bg-accent px-8 py-3.5 text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Contact Us
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-btn border border-white/20 bg-white/5 px-8 py-3.5 text-[15px] font-bold text-white backdrop-blur-xs transition-colors hover:bg-white/10"
            >
              Explore Events
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
