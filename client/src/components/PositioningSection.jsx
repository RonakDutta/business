import CoverImage from "./CoverImage.jsx";
import { ClayShapes } from "./Decor.jsx";
import {
  LightbulbIcon,
  ChartIcon,
  CompassIcon,
  LifebuoyIcon,
} from "./icons.jsx";

const PILLARS = [
  {
    label: "Ideas",
    note: "Say the half-formed one out loud and let the room shape it.",
    Icon: LightbulbIcon,
  },
  {
    label: "Insights",
    note: "What actually worked last quarter, numbers and all.",
    Icon: ChartIcon,
  },
  {
    label: "Exploration",
    note: "Sit in on a trade you know nothing about.",
    Icon: CompassIcon,
  },
  {
    label: "Business support",
    note: "A supplier, a first hire, a second opinion before you sign.",
    Icon: LifebuoyIcon,
  },
];

// The branding block: the name gets the big type, and the four things the room
// is for sit together in one panel rather than four floating cards.
export default function PositioningSection() {
  return (
    <section className="relative isolate py-16 md:py-24">
      <ClayShapes className="pointer-events-none absolute -left-24 top-10 -z-10 h-[420px] w-[420px] opacity-70 md:-left-10" />

      <div className="mx-auto grid max-w-shell items-stretch gap-8 px-5 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-12">
        <div className="reveal clay flex h-full min-h-[320px] overflow-hidden rounded-panel bg-white p-3">
          <CoverImage
            src="/images/gallery/2026-06-06/03.jpg"
            alt="Members talking at a Business 4.0 meetup"
            label="MEETUP PHOTO"
            className="h-full w-full rounded-[16px] object-cover"
          />
        </div>

        <div className="reveal flex flex-col justify-between" data-delay="0.1">
          <div>
            <h2 className="text-[38px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[50px] md:text-[56px]">
              Business <span className="text-accent">4.0</span>
            </h2>

            <p className="mt-2 text-[16px] font-bold tracking-[-0.01em] text-subtle sm:text-[18px]">
              A place for
            </p>
          </div>

          <div className="clay mt-5 rounded-panel bg-white p-2 sm:p-3">
            <div className="grid sm:grid-cols-2">
              {PILLARS.map(({ label, note, Icon }) => (
                <div
                  key={label}
                  className="flex gap-3.5 rounded-[16px] p-4 transition-colors duration-200 hover:bg-canvas sm:p-5"
                >
                  <span className="clay-inset grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[16px] font-extrabold tracking-[-0.01em] text-ink sm:text-[17px]">
                      {label}
                    </div>
                    <p className="mt-1 text-[13.5px] leading-[1.6] text-muted">
                      {note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
