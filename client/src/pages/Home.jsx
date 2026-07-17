import Hero from "../components/Hero.jsx";
import EventsSection from "../components/EventsSection.jsx";
import Team from "../components/Team.jsx";
import GalleryPreview from "../components/GalleryPreview.jsx";
import { WaveDivider } from "../components/Decor.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import { team } from "../data/team.js";

export default function Home() {
  const { upcomingEvents, pastEvents, photos } = useEvents();

  useReveal([upcomingEvents.length, pastEvents.length]);

  return (
    <>
      <Hero />

      {/* Tinted events band — waves blend it into the white above and below, a
          faint dot-field gives the block texture. Purely presentational. */}
      <div className="relative">
        <WaveDivider className="block h-10 w-full text-[color-mix(in_srgb,var(--b4-accent)_4%,#fff)] md:h-14" />

        <div className="section-tint relative overflow-hidden">
          <div
            aria-hidden
            className="dot-field pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(120%_100%_at_50%_0%,#000,transparent_78%)]"
          />

          <div className="relative">
            <EventsSection
              id="events"
              eyebrow="What's on"
              title="Upcoming events"
              events={upcomingEvents.slice(0, 3)}
              variant="upcoming"
              ctaLabel="View all events"
              headingClass="text-[30px] md:text-[38px]"
              className="pb-8 pt-12"
            />

            <EventsSection
              eyebrow="Look back"
              title="Past events"
              events={pastEvents.slice(0, 3)}
              variant="past"
              ctaLabel="Browse"
              headingClass="text-[26px] md:text-[30px]"
              className="pb-20 pt-12"
            />
          </div>
        </div>

        <WaveDivider
          flip
          className="block h-10 w-full text-[color-mix(in_srgb,var(--b4-accent)_4%,#fff)] md:h-14"
        />
      </div>

      <Team members={team} />

      <GalleryPreview photos={photos} />
    </>
  );
}
