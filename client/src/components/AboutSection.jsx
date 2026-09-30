import Stats from "./Stats.jsx";
import { CheckIcon } from "./icons.jsx";
import { audience, stats } from "../data/events.js";

// What Business 4.0 actually is, who it is for, and the numbers behind it.
export default function AboutSection() {
  return (
    <section id="about" className="section scroll-mt-20 bg-surface">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="reveal">
            <h2 className="display-2">
              Not a seminar. A room where people actually talk.
            </h2>

            <div className="mt-6 flex max-w-[62ch] flex-col gap-4 text-[16.5px] leading-[1.75] text-muted sm:text-[17px]">
              <p>
                Business 4.0 started as a handful of people meeting on a
                Saturday morning because the usual networking events were all
                pitch and no substance. Nearly two hundred editions later it is
                still the same idea: no stage, no sales deck, no badges.
              </p>
              <p>
                Everyone says who they are and what they are stuck on, and the
                room answers. You leave with the name of someone who has already
                solved the thing you are wrestling with.
              </p>
            </div>
          </div>

          <div data-delay="0.08" className="reveal card self-start p-6 sm:p-8">
            <h3 className="meta-label">Who turns up</h3>

            <ul className="mt-3 divide-y divide-line">
              {audience.map((person) => (
                <li key={person} className="flex items-center gap-3 py-3.5">
                  <CheckIcon className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-[16px] font-medium text-ink">{person}</span>
                </li>
              ))}
            </ul>

            <p className="mt-2 border-t border-line pt-4 text-[14.5px] leading-relaxed text-muted">
              If you are building something, or seriously plan to, you are in
              the right room.
            </p>
          </div>
        </div>

        <Stats items={stats} />
      </div>
    </section>
  );
}
