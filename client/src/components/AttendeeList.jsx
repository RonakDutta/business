import Avatar from "./Avatar.jsx";

/* Prime member styling is deliberately light for now; the concept isn't
   defined yet. When it is, extend ROLE_STYLES rather than the components. */
const ROLE_STYLES = {
  "Super organiser": "bg-accent/10 text-accent",
  Organiser: "bg-surface-strong text-ink",
  "Prime member": "bg-accent/10 text-accent",
  Member: "bg-surface-strong text-muted",
};

const isPrime = (role) => role === "Prime member";

function Person({ person, fallbackRole, ring }) {
  return (
    <li className="flex items-center gap-3">
      <Avatar person={person} size={40} ring={ring} />
      <div className="min-w-0">
        <div className="truncate text-[14.5px] font-semibold text-ink">{person.name}</div>
        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
            ROLE_STYLES[person.role] || ROLE_STYLES[fallbackRole]
          }`}
        >
          {person.role}
        </span>
      </div>
    </li>
  );
}

/**
 * `bare` drops the heading and the section chrome, for when the page already
 * supplies them: event detail puts "Who's coming" and the count in its label
 * rail, so the list would otherwise announce itself twice.
 */
export default function AttendeeList({
  attendees = [],
  total = 0,
  past = false,
  host = null,
  bare = false,
}) {
  if (!attendees.length && !host) return null;

  /* The host runs every edition, so they are always in the room, but they
     aren't in the attendee pool. They lead the list rather than being counted
     into it, which is why they are subtracted from the overflow. */
  const overflow = Math.max(0, total - attendees.length - (host ? 1 : 0));

  const copy = past
    ? { heading: "Who came", count: "attended", more: "more attended" }
    : { heading: "Who's coming", count: "going", more: "more members going" };

  const Wrapper = bare ? "div" : "section";

  return (
    <Wrapper className={bare ? "" : "reveal border-t border-line pt-12"}>
      {!bare && (
        <div className="mb-8 flex flex-wrap items-baseline gap-3">
          <h2 className="display-3">{copy.heading}</h2>
          <span className="text-[14px] text-subtle">
            {total.toLocaleString("en-IN")} {copy.count}
          </span>
        </div>
      )}

      <ul className="grid gap-x-6 gap-y-5 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {host && <Person person={host} fallbackRole="Organiser" ring />}

        {attendees.map((p) => (
          <Person key={p.id} person={p} fallbackRole="Member" ring={isPrime(p.role)} />
        ))}
      </ul>

      {overflow > 0 && (
        <p className="mt-6 text-[14px] text-subtle">
          And {overflow.toLocaleString("en-IN")} {copy.more}
        </p>
      )}
    </Wrapper>
  );
}
