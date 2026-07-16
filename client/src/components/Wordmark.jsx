import logoImg from "/images/logo/logo.jpeg";

export default function Wordmark({
  tone = "dark",
  size = "md",
  className = "",
}) {
  const small = size === "sm";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className={`overflow-hidden rounded-full ${
          small ? "h-7 w-7" : "h-8 w-8"
        }`}
      >
        <img src={logoImg} alt="Logo" className="h-full w-full object-cover" />
      </span>
      <span
        className={`font-extrabold tracking-[-0.03em] ${
          small ? "text-[15px]" : "text-[17px]"
        } ${tone === "light" ? "text-white" : "text-ink"}`}
      >
        Business 4.0
      </span>
    </span>
  );
}
