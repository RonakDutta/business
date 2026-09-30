import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useComments, MAX_COMMENT_LENGTH } from "../hooks/useComments.js";
import { ArrowRightIcon, TrashIcon } from "./icons.jsx";

/* ===========================================================================
   Members' notes on a meetup that has already happened.

   Shown on past editions only. Signed-out visitors can read the thread and get
   a prompt to sign in; signed-in members can post, and remove their own.

   Storage is this browser only for now: see hooks/useComments.js.
   =========================================================================== */

/** "2 hours ago" / "3 days ago" / a date once it's old enough to not matter. */
function timeAgo(iso) {
  const then = new Date(iso).getTime();
  const mins = Math.round((Date.now() - then) / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventComments({ event }) {
  const { user } = useAuth();
  const { comments, add, remove } = useComments(event.id);

  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = add(body, user);
    if (!res.ok) return setError(res.error);
    setBody("");
    setError("");
  };

  const left = MAX_COMMENT_LENGTH - body.length;

  return (
    <div>
      {user ? (
        <form onSubmit={submit} className="mb-10">
          <div className="flex gap-3">
            <Avatar person={{ name: user.name || user.email }} size={40} className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <label htmlFor="comment-body" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment-body"
                rows={3}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (error) setError("");
                }}
                maxLength={MAX_COMMENT_LENGTH}
                placeholder={`How was ${event.date.split(" · ")[0]}? What stuck with you?`}
                className="field resize-y"
              />

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                <span className={`text-[12.5px] ${left < 60 ? "font-semibold text-red-600" : "text-faint"}`}>
                  {left < 60 ? `${left} characters left` : ""}
                </span>

                <button type="submit" disabled={!body.trim()} className="btn btn-primary btn-sm">
                  Post comment
                  <ArrowRightIcon />
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-2 text-[13.5px] font-semibold text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface px-5 py-4">
          <p className="text-[15px] text-ink">Sign in to share how this meetup went.</p>
          <Link
            to={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`}
            className="btn btn-primary btn-sm"
          >
            Sign in
            <ArrowRightIcon />
          </Link>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted">
          No notes on this edition yet.
          {user ? " Be the first to leave one." : ""}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {comments.map((c) => {
            const mine = user && (user.id || user.email) === c.author.id;

            return (
              <li key={c.id} className="flex gap-3 py-5 first:pt-0">
                <Avatar person={{ name: c.author.name }} size={40} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="text-[14.5px] font-semibold text-ink">{c.author.name}</span>
                    {mine && <span className="badge h-5 bg-accent/10 px-2 text-[11px] text-accent">You</span>}
                    <span className="text-[13px] text-faint">{timeAgo(c.createdAt)}</span>
                  </div>

                  <p className="mt-1.5 whitespace-pre-wrap text-[15.5px] leading-[1.7] text-muted">
                    {c.body}
                  </p>
                </div>

                {mine && (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    aria-label="Delete your comment"
                    title="Delete"
                    className="icon-btn h-9 w-9 hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
