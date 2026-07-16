import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "b4:saved-events";
const SavedEventsContext = createContext(null);

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function SavedEventsProvider({ children }) {
  const [saved, setSaved] = useState(read);

  // Persist. Wrapped because Safari private mode throws on setItem.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      /* storage unavailable — saves stay in-memory for this session */
    }
  }, [saved]);

  // Keep other open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setSaved(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isSaved = useCallback((id) => saved.includes(id), [saved]);

  const value = useMemo(
    () => ({ saved, toggle, isSaved, count: saved.length }),
    [saved, toggle, isSaved]
  );

  return (
    <SavedEventsContext.Provider value={value}>
      {children}
    </SavedEventsContext.Provider>
  );
}

export function useSavedEvents() {
  const ctx = useContext(SavedEventsContext);
  if (!ctx) throw new Error("useSavedEvents must be used inside <SavedEventsProvider>");
  return ctx;
}
