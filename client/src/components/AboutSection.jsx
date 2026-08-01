import Stats from "./Stats.jsx";
import { ClayChat } from "./Decor.jsx";
import { CheckIcon } from "./icons.jsx";
import { audience, stats } from "../data/events.js";

// Page 1 of the sketch, under the hero: what Business 4.0 actually is, who it
// is for, and the numbers behind it.
export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative px-5 py-16 sm:px-6 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-shell">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="reveal">
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              The idea
            </div>

            <h2 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[34px] md:text-[40px]">
              Not a seminar. A room where people actually talk.
            </h2>

            <div className="mt-6 flex max-w-[620px] flex-col gap-4 text-[16px] leading-[1.75] text-muted sm:text-[17px]">
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

          <div className="reveal" data-delay="0.1">
            <div className="clay rounded-panel bg-white p-6 sm:p-8">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">
                Who turns up
              </div>

              <ul className="mt-5 flex flex-col gap-3.5">
                {audience.map((person) => (
                  <li key={person} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[15px] font-bold text-ink sm:text-[16px]">
                      {person}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-line pt-5 text-[14px] leading-relaxed text-muted">
                If you are building something , or seriously plan to , you are
                in the right room.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-5">
              <ClayChat className="pointer-events-none h-auto w-[150px] shrink-0 sm:w-[180px]" />
              <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-ink sm:text-[16px]">
                No stage. No sales deck. Just the room and whatever you brought
                to it.
              </p>
            </div>
          </div>
        </div>

        <Stats items={stats} />
      </div>
    </section>
  );
}
