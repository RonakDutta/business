import Hero from "../components/Hero.jsx";
import AboutSection from "../components/AboutSection.jsx";
import UpcomingSection from "../components/UpcomingSection.jsx";
import PositioningSection from "../components/PositioningSection.jsx";
import Testimonials from "../components/Testimonials.jsx";
import GalleryPreview from "../components/GalleryPreview.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { useEvents } from "../context/EventsContext.jsx";

export default function Home() {
  const { upcomingEvents, photos } = useEvents();

  useReveal([upcomingEvents.length, photos.length]);

  return (
    <>
      <Hero />

      <AboutSection />

      <UpcomingSection events={upcomingEvents} />

      <PositioningSection />

      <Testimonials />

      <GalleryPreview photos={photos} />
    </>
  );
}
