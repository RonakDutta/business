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

// Sections alternate between white and a light grey band, so each one reads
// as its own block without any decoration.
export default function Home() {
  const { upcomingEvents, albums, ready } = useEvents();

  useReveal([upcomingEvents.length, albums.length, ready]);

  return (
    <>
      <Hero />
      <AboutSection />
      <UpcomingSection events={upcomingEvents} />
      <PositioningSection />

      <section className="section">
        <div className="shell">
          <Team members={team} showHeader />
        </div>
      </section>

      <Testimonials />
      <GlimpsesSection albums={albums} />
    </>
  );
}
