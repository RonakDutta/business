import Avatar from "./Avatar.jsx";

/* Prime member styling is deliberately light for now — the concept isn't
   defined yet. When it is, extend ROLE_STYLES rather than the components. */
const ROLE_STYLES = {
  "Super organiser": "bg-accent text-white",
  Organiser: "bg-ink text-white",
  "Prime member": "bg-accent/10 text-accent",
  Member: "bg-line text-subtle",
};

const isPrime = (role) => role === "Prime member";

/**
 * `bare` drops the heading and the section chrome, for when the page already
 * supplies them — event detail puts "Who's coming" and the count in its label
 * rail, so the list would otherwise announce itself twice.
 */
export default function AttendeeList({
  attendees = [],
  total = 0,
  past = false,
  you = null,
  host = null,
  bare = false,
}) {
  if (!attendees.length && !you && !host) return null;

  /* The host runs every edition, so he's always in the room — he just isn't in
     the attendee pool. He leads the list rather than being counted into it,
     which is why he's subtracted from the overflow along with you. */
  const overflow = Math.max(
    0,
    total - attendees.length - (you ? 1 : 0) - (host ? 1 : 0),
  );

  // Tense follows the event, not just the heading.
  const copy = past
    ? { heading: "Who came", count: "attended", more: "more attended" }
    : { heading: "Who's coming", count: "going", more: "more members going" };

  const Wrapper = bare ? "div" : "section";

  return (
    <Wrapper className={bare ? "" : "reveal border-t border-line pt-12"}>
      {!bare && (
        <div className="mb-8 flex flex-wrap items-baseline gap-3">
          <h2 className="text-[26px] font-extrabold tracking-[-0.025em]">
            {copy.heading}
          </h2>
          <span className="text-sm font-semibold text-subtle">
            {total.toLocaleString("en-IN")} {copy.count}
          </span>
        </div>
      )}

      <ul className="grid gap-x-3 gap-y-3 [grid-template-columns:repeat(auto-fit,minmax(142px,1fr))] sm:gap-x-6 sm:gap-y-5 lg:grid-cols-4">
        {/* The organiser leads — he's the one constant in the room. */}
        {host && (
          <li className="flex items-center gap-2.5">
            <Avatar person={host} size={36} ring />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold text-ink sm:text-sm">
                {host.name}
              </div>
              <span
                className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em] sm:mt-1 sm:px-2 sm:text-[10px] ${
                  ROLE_STYLES[host.role] || ROLE_STYLES.Organiser
                }`}
              >
                {host.role}
              </span>
            </div>
          </li>
        )}

        {/* Then you. Seeing yourself in the list is the whole point of having
            RSVP'd. */}
        {you && (
          <li className="flex items-center gap-2.5">
            <span className="account-avatar grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white ring-2 ring-accent ring-offset-2 ring-offset-white">
              {(you.name || you.email || "?").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold text-ink sm:text-sm">You</div>
              <span className="mt-0.5 inline-block rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em] text-white sm:mt-1 sm:px-2 sm:text-[10px]">
                {past ? "Attended" : "Going"}
              </span>
            </div>
          </li>
        )}

        {attendees.map((p) => (
          <li key={p.id} className="flex items-center gap-2.5">
            <Avatar person={p} size={36} ring={isPrime(p.role)} />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold text-ink sm:text-sm">{p.name}</div>
              <span
                className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em] sm:mt-1 sm:px-2 sm:text-[10px] ${
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
        <p className="mt-5 text-sm font-semibold text-subtle">
          + {overflow.toLocaleString("en-IN")} {copy.more}
        </p>
      )}
    </Wrapper>
  );
}
