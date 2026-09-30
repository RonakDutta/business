import { Link } from "react-router-dom";
import Team from "../components/Team.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { ArrowRightIcon } from "../components/icons.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { team } from "../data/team.js";

export default function TeamPage() {
  useReveal([]);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Team" }]}
        title="The organising team"
        lead="Four of us run Business 4.0 between day jobs. We open the doors, keep the sessions on time, and make sure nobody stands in a corner alone."
      />

      <section className="shell pb-16 pt-12 md:pb-20 md:pt-16">
        <Team members={team} showHeader={false} />
      </section>

      <section className="shell pb-24">
        <div className="reveal card flex flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[540px]">
            <h2 className="display-3">Want to get in touch with the team?</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">
              Questions about a meetup, a partnership, or hosting a session?
              Write to us and one of us will reply.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn btn-primary">
              Contact us
              <ArrowRightIcon />
            </Link>
            <Link to="/events" className="btn btn-secondary">
              See upcoming events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
