import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useComments, MAX_COMMENT_LENGTH } from "../hooks/useComments.js";
import { ArrowRightIcon, TrashIcon } from "./icons.jsx";

/* ===========================================================================
   "How was it" — members' notes on a meetup that has already happened.

   Shown on past editions only: there's nothing to say about a room nobody has
   sat in yet. Signed-out visitors can read the thread and get a prompt to sign
   in; signed-in members can post, and remove their own.

   Storage is this browser only for now — see hooks/useComments.js.
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
        <form onSubmit={submit} className="mb-8">
          <div className="flex gap-3">
            <Avatar
              person={{ name: user.name || user.email }}
              size={36}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <textarea
                rows={3}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (error) setError("");
                }}
                maxLength={MAX_COMMENT_LENGTH}
                placeholder={`How was ${event.date.split(" · ")[0]}? What stuck with you?`}
                className="w-full resize-y rounded-2xl border border-line-strong bg-[#fafbfc] px-4 py-3 text-[15px] leading-relaxed text-ink transition-[border-color,background] duration-200 placeholder:text-faint focus:border-accent focus:bg-white focus:outline-none"
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-[12px] font-semibold ${
                    left < 60 ? "text-red-600" : "text-faint"
                  }`}
                >
                  {left < 60 ? `${left} characters left` : ""}
                </span>

                <button
                  type="submit"
                  disabled={!body.trim()}
                  className="inline-flex items-center gap-2 rounded-btn bg-ink px-5 py-2.5 text-[14px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-ink"
                >
                  Post comment
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-2 text-[13px] font-semibold text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="accent-border accent-tint mb-8 flex flex-wrap items-center justify-between gap-3 rounded-card border px-5 py-4">
          <p className="text-[14px] font-semibold text-ink">
            Sign in to share how this meetup went.
          </p>
          <Link
            to={`/login?next=${encodeURIComponent(`/events/${event.id}`)}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-btn bg-ink px-5 py-2.5 text-[13.5px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
          >
            Sign in
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-[14.5px] leading-relaxed text-muted">
          No notes on this edition yet
          {user ? " — be the first to leave one." : "."}
        </p>
      ) : (
        <ul className="flex flex-col gap-5">
          {comments.map((c) => {
            const mine = user && (user.id || user.email) === c.author.id;

            return (
              <li key={c.id} className="flex gap-3">
                <Avatar person={{ name: c.author.name }} size={36} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="text-[14px] font-bold text-ink">
                      {c.author.name}
                    </span>
                    {mine && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-accent">
                        You
                      </span>
                    )}
                    <span className="text-[12px] font-semibold text-faint">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-[1.7] text-muted">
                    {c.body}
                  </p>
                </div>

                {mine && (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    aria-label="Delete your comment"
                    title="Delete"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-faint transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
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
