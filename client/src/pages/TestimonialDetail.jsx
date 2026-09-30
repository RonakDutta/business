import { useParams, Link } from "react-router-dom";
import Avatar from "../components/Avatar.jsx";
import NotFound from "./NotFound.jsx";
import { ArrowRightIcon } from "../components/icons.jsx";
import { useReveal } from "../hooks/useReveal.js";
import { getTestimonial, testimonials } from "../data/testimonials.js";

export default function TestimonialDetail() {
  const { id } = useParams();
  const person = getTestimonial(id);

  useReveal([id]);

  if (!person) return <NotFound />;

  const others = testimonials.filter((other) => other.id !== person.id).slice(0, 3);

  return (
    <article>
      <header className="border-b border-line bg-surface">
        <div className="shell pb-12 pt-8 md:pb-16 md:pt-12">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-subtle">
              <li>
                <Link to="/" className="transition-colors hover:text-ink">Home</Link>
              </li>
              <li aria-hidden="true" className="text-faint">/</li>
              <li>Member stories</li>
              <li aria-hidden="true" className="text-faint">/</li>
              <li aria-current="page" className="font-medium text-ink">{person.name}</li>
            </ol>
          </nav>

          <div className="max-w-[860px]">
            {person.outcome && (
              <p className="reveal text-[14.5px] font-semibold text-accent">{person.outcome}</p>
            )}

            <blockquote data-delay="0.04" className="reveal mt-4">
              <p className="font-display text-[26px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink sm:text-[34px]">
                “{person.quote}”
              </p>
            </blockquote>

            <div data-delay="0.08" className="reveal mt-8 flex items-center gap-4">
              <Avatar person={person} size={52} />
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-ink">{person.name}</p>
                <p className="text-[14.5px] text-subtle">{person.role}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="shell pb-24 pt-12 md:pt-16">
        <div className="reveal flex max-w-[68ch] flex-col gap-5 text-[17px] leading-[1.8] text-muted">
          {person.story.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {others.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <h2 className="reveal display-3">More member stories</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.id}
                  to={`/testimonials/${other.id}`}
                  data-stagger
                  className="reveal card card-hover group flex flex-col p-6"
                >
                  <p className="font-display text-[16.5px] font-semibold leading-snug text-ink">
                    {other.outcome}
                  </p>
                  <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-muted">
                    “{other.quote}”
                  </p>
                  <div className="mt-auto flex items-center gap-2.5 pt-5">
                    <Avatar person={other} size={32} />
                    <span className="truncate text-[14px] font-semibold text-ink">{other.name}</span>
                    <ArrowRightIcon className="ml-auto h-4 w-4 shrink-0 text-faint transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
