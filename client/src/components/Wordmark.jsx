import logoImg from "/images/logo/logo.jpeg";

// The logo disc and the name. `tone="light"` is for dark backgrounds.
export default function Wordmark({ tone = "dark", size = "md", className = "" }) {
  const small = size === "sm";
  const light = tone === "light";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoImg}
        alt=""
        aria-hidden="true"
        className={`shrink-0 rounded-full object-cover ${
          light ? "ring-1 ring-white/15" : "ring-1 ring-black/5"
        } ${small ? "h-8 w-8" : "h-9 w-9"}`}
      />

      <span
        className={`font-display font-semibold tracking-[-0.02em] ${
          small ? "text-[15px]" : "text-[17px]"
        } ${light ? "text-white" : "text-ink"}`}
      >
        Business{" "}
        <span
          className={
            light
              ? "text-[color-mix(in_srgb,var(--b4-accent)_40%,white)]"
              : "text-accent"
          }
        >
          4.0
        </span>
      </span>
    </span>
  );
}
