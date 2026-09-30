import { Link } from "react-router-dom";

// The top of every inner page: where you are, the title, and one line of
// context. `actions` sits on the right on wide screens (buttons, a link), and
// `children` goes underneath (tabs, a stat strip).
export default function PageHeader({ crumbs = [], title, lead, actions, children }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="shell pb-10 pt-8 md:pb-14 md:pt-12">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-subtle">
              {crumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-faint">
                      /
                    </span>
                  )}
                  {crumb.to ? (
                    <Link to={crumb.to} className="transition-colors duration-200 hover:text-ink">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="max-w-[46ch] truncate font-medium text-ink">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-[760px]">
            <h1 className="reveal display-page">{title}</h1>
            {lead && (
              <p data-delay="0.06" className="reveal lead mt-4 max-w-[640px]">
                {lead}
              </p>
            )}
          </div>

          {actions && (
            <div data-delay="0.1" className="reveal flex flex-wrap gap-3">
              {actions}
            </div>
          )}
        </div>

        {children}
      </div>
    </header>
  );
}
