import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "b4:saved";
const SavedEventsContext = createContext(null);

// The hearts on event cards. Kept in this browser only, so it works
// whether or not someone is signed in.
export function SavedEventsProvider({ children }) {
  const [saved, setSaved] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  function toggle(eventId) {
    if (saved.includes(eventId)) setSaved(saved.filter((id) => id !== eventId));
    else setSaved([...saved, eventId]);
  }

  function isSaved(eventId) {
    return saved.includes(eventId);
  }

  return (
    <SavedEventsContext.Provider value={{ saved, toggle, isSaved, count: saved.length }}>
      {children}
    </SavedEventsContext.Provider>
  );
}

export function useSavedEvents() {
  return useContext(SavedEventsContext);
}
