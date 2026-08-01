import logoImg from "/images/logo/logo.jpeg";

export default function Wordmark({
  tone = "dark",
  size = "md",
  className = "",
}) {
  const small = size === "sm";

  const light = tone === "light";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {/* The logo sits in a moulded ring rather than being cut straight out of
          the bar , it is the one place the brand touches every page. */}
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center rounded-full p-[3px] ${
          light ? "clay-dark bg-white/10" : "clay bg-white"
        } ${small ? "h-8 w-8" : "h-9 w-9"}`}
      >
        <img
          src={logoImg}
          alt="Logo"
          className="h-full w-full rounded-full object-cover"
        />
      </span>

      <span
        className={`font-extrabold tracking-[-0.03em] ${
          small ? "text-[15px]" : "text-[17px]"
        } ${light ? "text-white" : "text-ink"}`}
      >
        Business{" "}
        {/* 4.0 carries the accent, same as the big branding block on the home
            page. On a dark bar the accent is lightened so it stays readable. */}
        <span
          className={
            light
              ? "text-[color-mix(in_srgb,var(--b4-accent)_35%,white)]"
              : "text-accent"
          }
        >
          4.0
        </span>
      </span>
    </span>
  );
}
