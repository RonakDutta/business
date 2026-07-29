import { createContext, useContext, useEffect, useState } from "react";
import { useEvents } from "./EventsContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { eventsApi, paymentsApi, rsvpsApi } from "../api";
import { dataUrlToBlob } from "../lib/image.js";

const RsvpContext = createContext(null);

export function RsvpProvider({ children }) {
  const { getEventById, reloadEvents } = useEvents();
  const { user } = useAuth();
  const [goingDates, setGoingDates] = useState([]);

  // Load the events this member has already joined.
  useEffect(() => {
    if (!user) {
      setGoingDates([]);
      return;
    }

    rsvpsApi
      .getMyRsvps()
      .then((rsvps) => setGoingDates(rsvps.map((rsvp) => rsvp.event_date)))
      .catch(() => setGoingDates([]));
  }, [user]);

  function isGoing(eventId) {
    return goingDates.includes(eventId);
  }

  // Called from the payment dialog. Uploads the payment screenshot first,
  // then books the seat, so we never book a seat with no proof of payment.
  async function confirm(eventId, submission) {
    const event = getEventById(eventId);
    if (!event) return { ok: false, error: "That event no longer exists." };

    const paymentRef = submission?.payment?.reference;
    const screenshot = submission?.paymentProof?.imageDataUrl;

    try {
      if (screenshot) {
        await paymentsApi.submitPayment({
          proof: dataUrlToBlob(screenshot),
          eventId: event.serverId,
          payerName: submission.payer.name,
          payerEmail: submission.payer.email,
          paymentRef,
          amount: submission.payment.amount,
        });
      }

      await eventsApi.joinEvent(event.serverId, paymentRef);

      setGoingDates([...goingDates, eventId]);
      await reloadEvents();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function cancel(eventId) {
    const event = getEventById(eventId);
    if (!event) return { ok: false, error: "That event no longer exists." };

    try {
      await eventsApi.leaveEvent(event.serverId);
      setGoingDates(goingDates.filter((date) => date !== eventId));
      await reloadEvents();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  return (
    <RsvpContext.Provider value={{ isGoing, confirm, cancel }}>
      {children}
    </RsvpContext.Provider>
  );
}

export function useRsvp() {
  return useContext(RsvpContext);
}
