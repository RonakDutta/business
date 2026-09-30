// Heading block used by the home page sections: a title, an optional line of
// context under it, and an optional link on the right (e.g. "See all").
export default function SectionHeader({ title, lead, action, className = "" }) {
  return (
    <div
      className={`reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-5 ${className}`}
    >
      <div className="max-w-[660px]">
        <h2 className="display-2">{title}</h2>
        {lead && <p className="lead mt-4">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
