import { useCallback, useEffect, useState } from "react";

/* ===========================================================================
   Comments on a held meetup — FRONTEND ONLY for now.

   Everything lives in this browser's localStorage, keyed by event id. The
   `comments` table exists in the backend schema (server/src/db/schema.sql),
   but there are no routes yet, so nothing here talks to the server: comments
   you leave are visible to you and don't reach anyone else.

   WHEN THE API LANDS: replace the four functions below with calls to
   /api/events/:id/comments. Every component keeps working as-is — the shape
   ({ id, eventId, author, body, createdAt }) is already what a row will map to.
   =========================================================================== */

const KEY = "b4:comments";

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
    return true;
  } catch {
    return false; /* storage full or unavailable — this session only */
  }
}

export const MAX_COMMENT_LENGTH = 600;

export function useComments(eventId) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(readAll()[eventId] ?? []);
  }, [eventId]);

  const persist = useCallback(
    (next) => {
      setComments(next);
      const all = readAll();
      all[eventId] = next;
      writeAll(all);
    },
    [eventId],
  );

  /** `user` is the signed-in account; returns { ok, error }. */
  const add = useCallback(
    (body, user) => {
      const text = body.trim();
      if (!user) return { ok: false, error: "Sign in to leave a comment." };
      if (!text) return { ok: false, error: "Write something first." };
      if (text.length > MAX_COMMENT_LENGTH)
        return { ok: false, error: `Keep it under ${MAX_COMMENT_LENGTH} characters.` };

      const comment = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        eventId,
        author: {
          id: user.id || user.email,
          name: user.name || user.email,
          email: user.email,
        },
        body: text,
        createdAt: new Date().toISOString(),
      };

      persist([comment, ...comments]);
      return { ok: true };
    },
    [comments, eventId, persist],
  );

  /** Only the author can remove their own note. */
  const remove = useCallback(
    (id) => persist(comments.filter((c) => c.id !== id)),
    [comments, persist],
  );

  return { comments, add, remove };
}
