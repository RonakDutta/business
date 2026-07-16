import Hero from "../components/Hero.jsx";
import EventsSection from "../components/EventsSection.jsx";
import Team from "../components/Team.jsx";
import GalleryPreview from "../components/GalleryPreview.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";
import { team } from "../data/team.js";

export default function Home() {
  const { upcomingEvents, pastEvents, photos } = useEvents();

  useReveal([upcomingEvents.length, pastEvents.length]);

  return (
    <>
      <Hero />

      <EventsSection
        id="events"
        title="Upcoming events"
        events={upcomingEvents.slice(0, 3)}
        variant="upcoming"
        ctaLabel="View all events →"
        headingClass="text-[30px] md:text-[38px]"
        className="pb-8 pt-12"
      />

      <EventsSection
        title="Past events"
        events={pastEvents.slice(0, 3)}
        variant="past"
        ctaLabel="Browse →"
        headingClass="text-[26px] md:text-[30px]"
        className="pb-20 pt-12"
      />

      <Team members={team} />

      <GalleryPreview photos={photos} />
    </>
  );
}
