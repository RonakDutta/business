import Hero from "../components/Hero.jsx";
import AboutSection from "../components/AboutSection.jsx";
import UpcomingSection from "../components/UpcomingSection.jsx";
import PositioningSection from "../components/PositioningSection.jsx";
import Team from "../components/Team.jsx";
import Testimonials from "../components/Testimonials.jsx";
import GlimpsesSection from "../components/GlimpsesSection.jsx";
import { team } from "../data/team.js";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";

export default function Home() {
  const { upcomingEvents, albums } = useEvents();

  useReveal([upcomingEvents.length, albums.length]);

  return (
    <>
      <Hero />

      <AboutSection />

      <UpcomingSection events={upcomingEvents} />

      <PositioningSection />

      <section className="relative px-5 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-shell">
          <Team members={team} showHeader={true} />
        </div>
      </section>

      <Testimonials />

      <GlimpsesSection albums={albums} />
    </>
  );
}
