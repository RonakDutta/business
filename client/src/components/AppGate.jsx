import { useAuth } from "../context/AuthContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";
import AppSkeleton from "./AppSkeleton.jsx";

export default function AppGate({ children }) {
  const { ready: authReady } = useAuth();
  const { ready: eventsReady } = useEvents();

  if (!authReady || !eventsReady) return <AppSkeleton />;
  return children;
}
