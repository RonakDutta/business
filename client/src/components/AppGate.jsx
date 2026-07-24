import { useAuth } from "../context/AuthContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import AppSkeleton from "./AppSkeleton.jsx";

/*
  Holds a full-screen skeleton over the app until the core contexts have
  settled — the session restore (AuthContext) and the events load
  (EventsContext). In stub mode both resolve almost instantly; against the API
  this covers the real fetch time, including a cold Render backend waking from
  sleep (30-60s), where a layout-shaped skeleton beats a spinner. Must live
  inside the providers it reads.
*/
export default function AppGate({ children }) {
  const { ready: authReady } = useAuth();
  const { ready: eventsReady } = useEvents();

  if (!authReady || !eventsReady) return <AppSkeleton />;
  return children;
}
