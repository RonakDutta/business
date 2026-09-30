import { useParams, Link } from "react-router-dom";
import Avatar from "../components/Avatar.jsx";
import BackLink from "../components/BackLink.jsx";
import NotFound from "./NotFound.jsx";
import { Orb, Rings } from "../components/Decor.jsx";
import { ArrowRightIcon, SparkleIcon } from "../components/icons.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { getTestimonial, testimonials } from "../data/testimonials.js";

export default function TestimonialDetail() {
  const { id } = useParams();
  const person = getTestimonial(id);

  useReveal([id]);

  if (!person) return <NotFound />;

  const others = testimonials.filter((other) => other.id !== person.id).slice(0, 3);

  return (
    <article className="relative isolate mx-auto max-w-shell px-5 pb-24 pt-12 sm:px-6 md:px-10">
      <Orb className="pointer-events-none absolute -left-24 -top-10 -z-10 h-64 w-64 text-accent blur-3xl" />
      <Rings className="pointer-events-none absolute -right-20 top-0 -z-10 hidden h-72 w-72 text-accent md:block" />

      <BackLink to="/">Back home</BackLink>

      <header className="reveal mt-8 flex items-center gap-4">
        <Avatar person={person} size={64} ring />
        <div className="min-w-0">
          <h1 className="text-[24px] font-extrabold tracking-[-0.03em] sm:text-[30px]">
            {person.name}
          </h1>
          <p className="mt-1 text-[14px] font-semibold text-subtle sm:text-[15px]">
            {person.role}
          </p>
        </div>
      </header>

      {person.outcome && (
        <div className="clay-inset reveal mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold text-accent">
          <SparkleIcon className="h-4 w-4" />
          {person.outcome}
        </div>
      )}

      <blockquote
        data-delay="0.06"
        className="reveal clay mt-9 rounded-panel bg-white p-7 text-[20px] font-bold leading-[1.5] tracking-[-0.02em] text-ink sm:p-9 sm:text-[26px]"
      >
        “{person.quote}”
      </blockquote>

      <div
        data-delay="0.12"
        className="reveal mt-9 flex max-w-[68ch] flex-col gap-5 text-[16px] leading-[1.8] text-muted sm:text-[17px]"
      >
        {person.story.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {others.length > 0 && (
        <section className="reveal mt-16 border-t border-line pt-10">
          <h2 className="text-[13px] font-extrabold uppercase tracking-[0.09em] text-ink">
            More from the room
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.id}
                to={`/testimonials/${other.id}`}
                className="clay clay-press group flex flex-col rounded-card bg-white p-5"
              >
                <p className="line-clamp-3 text-[14px] leading-relaxed text-muted">
                  “{other.quote}”
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  <Avatar person={other} size={30} />
                  <span className="truncate text-[13px] font-bold text-ink">
                    {other.name}
                  </span>
                  <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-faint transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
