import { useAuth } from "../context/AuthContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import Loader from "./Loader.jsx";

/*
  Holds the full-screen Loader over the app until the core contexts have
  settled — the session restore (AuthContext) and the events load
  (EventsContext). Today both resolve almost instantly (localStorage / seed);
  once they're wired to the API this is where the real fetch time is covered,
  so nothing renders half-loaded. Must live inside the providers it reads.
*/
export default function AppGate({ children }) {
  const { ready: authReady } = useAuth();
  const { ready: eventsReady } = useEvents();

  if (!authReady || !eventsReady) return <Loader />;
  return children;
}
