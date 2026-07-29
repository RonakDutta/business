import { createContext, useContext, useEffect, useState } from "react";
import { eventsApi } from "../api";
import { buildEvent, sortByDateAsc, sortByDateDesc } from "../lib/events-model.js";
import { dataUrlToBlob, isUploadedImage } from "../lib/image.js";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadEvents().finally(() => setReady(true));
  }, []);

  async function loadEvents() {
    try {
      const eventsFromServer = await eventsApi.getEvents();
      setEvents(eventsFromServer.map(buildEvent));
    } catch (error) {
      console.error("Could not load events:", error.message);
      setEvents([]);
    }
  }

  // Newly picked images are data URLs, so turn them into files the server
  // can upload to Cloudinary. Images that are already online are left alone.
  async function uploadNewPhotos(eventId, photos = []) {
    for (const photo of photos) {
      if (isUploadedImage(photo)) {
        await eventsApi.addPhoto(eventId, dataUrlToBlob(photo));
      }
    }
  }

  async function addEvent(form) {
    try {
      const created = await eventsApi.createEvent({
        date: form.date,
        title: form.title,
        entryFee: form.entryFee,
        attendeeCount: form.attendeeCount,
        description: form.description,
        image: isUploadedImage(form.image) ? dataUrlToBlob(form.image) : undefined,
      });

      await uploadNewPhotos(created.id, form.photos);
      await loadEvents();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  // Pages pass the date (what the URL shows), so look up the database id.
  function getServerId(eventId) {
    return events.find((event) => event.id === eventId)?.serverId;
  }

  async function updateEvent(eventId, form) {
    const serverId = getServerId(eventId);
    if (!serverId) return { ok: false, error: "That event no longer exists." };

    try {
      await eventsApi.updateEvent(serverId, {
        date: form.date,
        title: form.title,
        entryFee: form.entryFee,
        attendeeCount: form.attendeeCount,
        cancelled: form.cancelled,
        description: form.description,
        image: isUploadedImage(form.image) ? dataUrlToBlob(form.image) : undefined,
      });

      await uploadNewPhotos(serverId, form.photos);
      await loadEvents();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function setEventCancelled(eventId, cancelled) {
    const serverId = getServerId(eventId);
    if (!serverId) return { ok: false, error: "That event no longer exists." };

    try {
      await eventsApi.updateEvent(serverId, { cancelled });
      await loadEvents();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function removeEvent(eventId) {
    const serverId = getServerId(eventId);
    if (!serverId) return { ok: false, error: "That event no longer exists." };

    try {
      await eventsApi.deleteEvent(serverId);
      await loadEvents();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  function getEventById(eventId) {
    return events.find((event) => event.id === eventId);
  }

  const upcomingEvents = events.filter((event) => !event.isPast).sort(sortByDateAsc);
  const pastEvents = events
    .filter((event) => event.isPast && !event.cancelled)
    .sort(sortByDateDesc);

  const albums = pastEvents
    .filter((event) => event.gallery.length > 0)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      place: event.place,
      status: event.status,
      cover: event.image,
      photos: event.gallery,
      count: event.gallery.length,
    }));

  const photos = albums.flatMap((album) => album.photos).slice(0, 6);

  return (
    <EventsContext.Provider
      value={{
        allEvents: events,
        upcomingEvents,
        pastEvents,
        albums,
        photos,
        ready,
        getEventById,
        getAlbumById: (albumId) => albums.find((album) => album.id === albumId),
        reloadEvents: loadEvents,
        addEvent,
        updateEvent,
        setEventCancelled,
        removeEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventsContext);
}
