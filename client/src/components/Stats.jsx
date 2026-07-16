import { useCountUp } from "../hooks/useCountUp.js";

function Stat({ value, suffix, label, decimals = 0 }) {
  const [ref, current] = useCountUp(value, { decimals });

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-8 text-center md:py-10">
      {/*
        tabular-nums keeps every digit the same width — without it the number
        visibly jitters while counting up from 0.
      */}
      <div
        ref={ref}
        className="text-[32px] font-extrabold tabular-nums leading-none tracking-[-0.03em] text-accent md:text-[42px]"
      >
        {current.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </div>

      <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-subtle md:text-xs">
        {label}
      </div>
    </div>
  );
}

export default function Stats({ items }) {
  return (
    <div className="reveal mx-auto mt-14 max-w-[860px] overflow-hidden rounded-panel border border-line bg-gradient-to-b from-white to-[#f8f9fc] shadow-[0_16px_40px_-32px_rgba(15,23,42,.5)]">
      <div className="grid grid-cols-3 divide-x divide-line">
        {items.map((s) => (
          <Stat key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
}
