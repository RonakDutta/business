import CoverImage from "./CoverImage.jsx";

const PILLARS = ["Ideas", "Insights", "Exploration", "Business support"];

// Page 2 of the sketch: a wide picture on the left, and what the room is for
// on the right.
export default function PositioningSection() {
  return (
    <section className="px-5 py-14 sm:px-6 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="reveal clay overflow-hidden rounded-panel">
          <CoverImage
            src="/images/gallery/2026-06-06/03.jpg"
            alt="Members talking at a Business 4.0 meetup"
            label="MEETUP PHOTO"
            className="aspect-[4/3] w-full"
          />
        </div>

        <div className="reveal" data-delay="0.1">
          <div className="text-[11px] font-bold uppercase tracking-[0.13em] text-accent">
            Business 4.0
          </div>

          <h2 className="mt-3 text-[30px] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-[38px] md:text-[44px]">
            A place for
          </h2>

          <ul className="mt-7 flex flex-col gap-3">
            {PILLARS.map((pillar) => (
              <li
                key={pillar}
                className="clay flex items-center gap-4 rounded-card bg-white px-5 py-4"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                <span className="text-[17px] font-extrabold tracking-[-0.01em] text-ink sm:text-[19px]">
                  {pillar}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
