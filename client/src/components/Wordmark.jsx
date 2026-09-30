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
          the bar, it is the one place the brand touches every page. */}
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center rounded-full p-[3px] ${
          light
            ? "clay-dark bg-white/10"
            : "clay bg-white ring-2 ring-accent/15 ring-offset-0"
        } ${small ? "h-8 w-8" : "h-9 w-9"}`}
      >
        <img
          src={logoImg}
          alt="Logo"
          className="h-full w-full rounded-full object-cover"
        />
      </span>

      <span
        className={`inline-flex items-center gap-1.5 font-extrabold leading-none tracking-[-0.035em] ${
          small ? "text-[15px]" : "text-[17.5px]"
        } ${light ? "text-white" : "text-ink"}`}
      >
        Business
        {/* 4.0 as a little clay tag in the brand blue: lit along the top,
            shaded underneath, tipped slightly like a sticker. */}
        <span
          className={`inline-block -rotate-[4deg] rounded-[9px] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--b4-accent)_70%,white),var(--b4-accent)_60%)] px-[0.4em] py-[0.28em] text-[0.8em] tracking-[-0.02em] text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,.55),inset_0_-2px_3px_rgba(30,58,138,.35),0_4px_10px_-4px_var(--b4-accent)] ${
            light ? "ring-1 ring-white/15" : ""
          }`}
        >
          4.0
        </span>
      </span>
    </span>
  );
}
