import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../../context/EventsContext.jsx";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "../../data/events.js";
import Avatar from "../../components/Avatar.jsx";
import { priceLabel } from "../../lib/format.js";
import BackLink from "../../components/BackLink.jsx";
import { CheckIcon, UsersIcon } from "../../components/icons.jsx";

const field =
  "w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-[15px] text-ink transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none";
const labelCls =
  "text-[12px] font-bold uppercase tracking-[0.07em] text-subtle";

function Row({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelCls}>{label}</span>
      {children}
      {hint && (
        <span className="text-[12px] leading-relaxed text-subtle">{hint}</span>
      )}
    </label>
  );
}

function Card({ title, note, children }) {
  return (
    <section className="rounded-card border border-line bg-white p-6">
      <div className="mb-5">
        <h2 className="text-[15px] font-extrabold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {note && <p className="mt-1 text-[12.5px] text-subtle">{note}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecord, getEventById, addEvent, updateEvent } = useEvents();

  const editing = Boolean(id);
  const record = editing ? getRecord(id) : null;
  const built = editing ? getEventById(id) : null;

  const [form, setForm] = useState(() => ({
    date: record?.date ?? "",
    title: record?.title ?? "",
    entryFee: String(record?.entryFee ?? 150),
    attendeeCount: String(record?.attendeeCount ?? 0),
    description: (record?.description ?? DEFAULT_DESCRIPTION).join("\n\n"),
    photos: (record?.photos ?? []).join(", "),
    cancelled: Boolean(record?.cancelled),
  }));
  const [error, setError] = useState("");

  if (editing && !record) {
    return (
      <div className="rounded-card border border-line bg-white p-12 text-center">
        <p className="font-bold text-ink">No meetup with that date.</p>
        <div className="mt-5 flex justify-center">
          <BackLink to="/admin">Back to meetups</BackLink>
        </div>
      </div>
    );
  }

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const save = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date))
      return setError("Pick a date , it doubles as the event's ID and URL.");

    const next = {
      date: form.date,
      title: form.title.trim() || undefined,
      entryFee: Number(form.entryFee) || 0,
      attendeeCount: Number(form.attendeeCount) || 0,
      description: form.description
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
      photos: form.photos
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      cancelled: form.cancelled,
    };

    const res = editing ? updateEvent(id, next) : addEvent(next);
    if (!res.ok) return setError(res.error);
    navigate("/admin");
  };

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(form.date);
  const weekday = validDate
    ? new Date(`${form.date}T11:00:00+05:30`).toLocaleDateString("en-IN", {
        weekday: "long",
        timeZone: "Asia/Kolkata",
      })
    : null;

  return (
    <>
      <BackLink to="/admin">Meetups</BackLink>

      <header className="mb-8 mt-3">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-subtle">
          {editing ? "Editing" : "New"}
        </div>
        <h1 className="mt-1.5 text-[30px] font-extrabold tracking-[-0.035em] md:text-[34px]">
          {editing ? "Edit meetup" : "Add meetup"}
        </h1>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Card
            title="The basics"
            note="Date, name and what it costs to walk in."
          >
            <Row
              label="Date"
              hint={
                weekday
                  ? `${weekday} · 11:00 AM–1:00 PM IST. This date is the event's URL.`
                  : "Every meetup is a Saturday, 11:00 AM–1:00 PM IST."
              }
            >
              <input
                type="date"
                className={field}
                value={form.date}
                onChange={set("date")}
              />
            </Row>

            <Row label="Title" hint={`Leave blank for “${DEFAULT_TITLE}”.`}>
              <input
                className={field}
                placeholder={DEFAULT_TITLE}
                value={form.title}
                onChange={set("title")}
              />
            </Row>

            <div className="grid grid-cols-2 gap-4">
              <Row label="Entry fee (₹)" hint="0 shows as “Free”.">
                <input
                  type="number"
                  min="0"
                  className={field}
                  value={form.entryFee}
                  onChange={set("entryFee")}
                />
              </Row>
              <Row label="Attendees" hint="RSVPs from the site add to this.">
                <input
                  type="number"
                  min="0"
                  className={field}
                  value={form.attendeeCount}
                  onChange={set("attendeeCount")}
                />
              </Row>
            </div>
          </Card>

          <Card
            title="What people read"
            note="Shown on the event page, under the cover."
          >
            <Row label="Description" hint="Blank line between paragraphs.">
              <textarea
                rows={8}
                className={`${field} resize-y leading-relaxed`}
                value={form.description}
                onChange={set("description")}
              />
            </Row>

            <Row
              label="Photo filenames"
              hint={`Comma separated. Files go in public/images/gallery/${form.date || "<date>"}/`}
            >
              <input
                className={field}
                placeholder="01.jpg, 02.jpg"
                value={form.photos}
                onChange={set("photos")}
              />
            </Row>
          </Card>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-card border p-5 transition-colors duration-200 ${
              form.cancelled
                ? "border-red-200 bg-red-50/60"
                : "border-line bg-white hover:border-line-strong"
            }`}
          >
            <input
              type="checkbox"
              checked={form.cancelled}
              onChange={set("cancelled")}
              className="mt-0.5 h-4 w-4 accent-red-600"
            />
            <span>
              <span className="block text-sm font-bold text-ink">
                This edition is cancelled
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-subtle">
                It stays listed with a badge so members who already RSVP'd see
                it's off, rather than quietly vanishing.
              </span>
            </span>
          </label>

          {error && (
            <p className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-2 rounded-btn bg-ink px-7 py-3.5 text-[15px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
            >
              <CheckIcon className="h-4 w-4" />
              {editing ? "Save changes" : "Create meetup"}
            </button>
            <Link
              to="/admin"
              className="rounded-btn border border-line-strong px-6 py-3.5 text-[15px] font-bold text-muted transition-colors duration-200 hover:border-ink hover:text-ink"
            >
              Discard
            </Link>
          </div>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-8">
          {/* How the card will read once it's live. */}
          <div className="rounded-card border border-line bg-white p-6">
            <h2 className="text-[15px] font-extrabold tracking-[-0.01em]">
              How it'll read
            </h2>
            <dl className="mt-4 flex flex-col gap-3 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">Title</dt>
                <dd className="truncate text-right font-bold text-ink">
                  {form.title.trim() || DEFAULT_TITLE}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">Entry</dt>
                <dd className="font-bold text-ink">
                  {priceLabel(Number(form.entryFee) || 0)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">URL</dt>
                <dd className="truncate font-mono text-[11.5px] text-muted">
                  /events/{form.date || "…"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Attendees , read-only until there's a real RSVP table */}
          <div className="rounded-card border border-line bg-white p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.01em]">
                <UsersIcon className="h-4 w-4 text-subtle" />
                Who's going
              </h2>
              <span className="text-sm font-bold tabular-nums text-subtle">
                {built?.attendeeCount ?? (Number(form.attendeeCount) || 0)}
              </span>
            </div>

            {built?.attendees?.length ? (
              <ul className="mt-5 flex flex-col gap-3">
                {built.attendees.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <Avatar
                      person={p}
                      size={34}
                      ring={p.role === "Prime member"}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-bold text-ink">
                        {p.name}
                      </div>
                      <div className="text-[11px] font-semibold text-subtle">
                        {p.role}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[13px] leading-relaxed text-subtle">
                {editing
                  ? "Nobody yet."
                  : "Appears once the meetup is created."}
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
