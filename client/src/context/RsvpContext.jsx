import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useEvents } from "./EventsContext.jsx";

const KEY = "b4:rsvps";
const RsvpContext = createContext(null);

/* ===========================================================================
   Who's going, from this browser's point of view.

   Two things have to move together when someone pays: the meetup's attendee
   count (a fact about the event , lives in EventsContext, which is why the
   admin table updates at the same moment the public page does) and the list of
   meetups *you* joined (a fact about you , lives here).

   Keeping the list here is also what makes confirm() safe to call twice: the
   count only moves for a meetup you aren't already on.

   Sits inside <EventsProvider> because it calls into it.
   =========================================================================== */

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function RsvpProvider({ children }) {
  const { addAttendee } = useEvents();
  const [ids, setIds] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* storage unavailable , this session only */
    }
  }, [ids]);

  const isGoing = useCallback((id) => ids.includes(id), [ids]);

  const confirm = useCallback(
    (id) => {
      if (ids.includes(id)) return;
      setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      addAttendee(id, +1);
    },
    [ids, addAttendee],
  );

  const cancel = useCallback(
    (id) => {
      if (!ids.includes(id)) return;
      setIds((prev) => prev.filter((x) => x !== id));
      addAttendee(id, -1);
    },
    [ids, addAttendee],
  );

  const value = useMemo(
    () => ({ ids, isGoing, confirm, cancel, count: ids.length }),
    [ids, isGoing, confirm, cancel],
  );

  return <RsvpContext.Provider value={value}>{children}</RsvpContext.Provider>;
}

export function useRsvp() {
  const ctx = useContext(RsvpContext);
  if (!ctx) throw new Error("useRsvp must be used inside <RsvpProvider>");
  return ctx;
}
