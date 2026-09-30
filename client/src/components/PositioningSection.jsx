const PILLARS = [
  {
    label: "Ideas",
    note: "Say the half-formed one out loud and let the room shape it.",
  },
  {
    label: "Insights",
    note: "What actually worked last quarter, numbers and all.",
  },
  {
    label: "Exploration",
    note: "Sit in on a trade you know nothing about.",
  },
  {
    label: "Business support",
    note: "A supplier, a first hire, a second opinion before you sign.",
  },
];

const PHOTOS = [
  {
    src: "/images/gallery/2026-04-25/06.jpg",
    alt: "Members around the tables at a Saturday meetup",
    className: "row-span-2",
  },
  {
    src: "/images/gallery/2026-05-23/04.jpg",
    alt: "A conversation by the window",
  },
  {
    src: "/images/gallery/2026-06-06/03.jpg",
    alt: "The group outside the venue after a session",
  },
];

// The branding block: the name in big type, and the four things the room is
// for as a short numbered list, next to a few photos from past meetups.
export default function PositioningSection() {
  return (
    <section className="section bg-surface">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="reveal grid h-[340px] grid-cols-2 grid-rows-2 gap-3 sm:h-[480px] sm:gap-4 lg:h-[540px]">
          {PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className={`overflow-hidden rounded-card bg-surface-strong ${photo.className || ""}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div data-delay="0.08" className="reveal">
          <h2 className="font-display text-[44px] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[64px]">
            Business <span className="text-accent">4.0</span>
          </h2>
          <p className="mt-4 font-display text-[20px] font-medium text-muted sm:text-[22px]">
            A place for
          </p>

          <ol className="mt-8 divide-y divide-line border-y border-line">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.label} className="grid grid-cols-[2.75rem_1fr] gap-3 py-5">
                <span className="pt-0.5 font-display text-[15px] font-semibold text-accent tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.01em]">
                    {pillar.label}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">
                    {pillar.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
