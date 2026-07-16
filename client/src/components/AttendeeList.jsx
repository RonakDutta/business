import Avatar from "./Avatar.jsx";

/* Prime member styling is deliberately light for now — the concept isn't
   defined yet. When it is, extend ROLE_STYLES rather than the components. */
const ROLE_STYLES = {
  Organiser: "bg-ink text-white",
  "Prime member": "bg-accent/10 text-accent",
  Member: "bg-line text-subtle",
};

const isPrime = (role) => role === "Prime member";

export default function AttendeeList({
  attendees = [],
  total = 0,
  past = false,
  you = null,
}) {
  if (!attendees.length && !you) return null;

  const overflow = Math.max(0, total - attendees.length - (you ? 1 : 0));

  // Tense follows the event, not just the heading.
  const copy = past
    ? { heading: "Who came", count: "attended", more: "more attended" }
    : { heading: "Who's coming", count: "going", more: "more members going" };

  return (
    <section className="reveal border-t border-line pt-12">
      <div className="mb-8 flex flex-wrap items-baseline gap-3">
        <h2 className="text-[26px] font-extrabold tracking-[-0.025em]">
          {copy.heading}
        </h2>
        <span className="text-sm font-semibold text-subtle">
          {total.toLocaleString("en-IN")} {copy.count}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {/* You go first. Seeing yourself in the list is the whole point of
            having RSVP'd. */}
        {you && (
          <li className="flex items-center gap-3">
            <span className="account-avatar grid h-11 w-11 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white ring-2 ring-accent ring-offset-2 ring-offset-white">
              {(you.name || you.email || "?").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-ink">You</div>
              <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-white">
                {past ? "Attended" : "Going"}
              </span>
            </div>
          </li>
        )}

        {attendees.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <Avatar person={p} size={44} ring={isPrime(p.role)} />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-ink">{p.name}</div>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] ${
                  ROLE_STYLES[p.role] || ROLE_STYLES.Member
                }`}
              >
                {p.role}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {overflow > 0 && (
        <p className="mt-8 text-sm font-semibold text-subtle">
          + {overflow.toLocaleString("en-IN")} {copy.more}
        </p>
      )}
    </section>
  );
}
