import { useEffect, useState } from "react";

// Comments are kept in this browser only for now. The database table exists
// but there are no routes yet, so nothing is sent to the server.

const STORAGE_KEY = "b4:comments";

export const MAX_COMMENT_LENGTH = 600;

function readAllComments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function useComments(eventId) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(readAllComments()[eventId] || []);
  }, [eventId]);

  function save(nextComments) {
    setComments(nextComments);
    const allComments = readAllComments();
    allComments[eventId] = nextComments;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
  }

  function add(text, user) {
    const body = text.trim();
    if (!user) return { ok: false, error: "Sign in to leave a comment." };
    if (!body) return { ok: false, error: "Write something first." };
    if (body.length > MAX_COMMENT_LENGTH) {
      return { ok: false, error: `Keep it under ${MAX_COMMENT_LENGTH} characters.` };
    }

    const comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eventId,
      author: { id: user.id, name: user.name, email: user.email },
      body,
      createdAt: new Date().toISOString(),
    };

    save([comment, ...comments]);
    return { ok: true };
  }

  function remove(commentId) {
    save(comments.filter((comment) => comment.id !== commentId));
  }

  return { comments, add, remove };
}
