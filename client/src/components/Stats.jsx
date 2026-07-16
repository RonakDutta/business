import { useCountUp } from "../hooks/useCountUp.js";

function Stat({ value, suffix, label, decimals = 0 }) {
  const [ref, current] = useCountUp(value, { decimals });

  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-6 text-center sm:px-4 sm:py-8 md:py-10">
      {/*
        tabular-nums keeps every digit the same width , without it the number
        visibly jitters while counting up from 0.
      */}
      <div
        ref={ref}
        className="text-[24px] font-extrabold tabular-nums leading-none tracking-[-0.03em] text-accent sm:text-[32px] md:text-[42px]"
      >
        {current.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </div>

      <div className="text-[9px] font-bold uppercase tracking-[0.07em] text-subtle sm:text-[11px] sm:tracking-[0.1em] md:text-xs">
        {label}
      </div>
    </div>
  );
}

export default function Stats({ items }) {
  return (
    <div className="reveal mx-auto mt-10 max-w-[860px] overflow-hidden rounded-panel border border-line bg-gradient-to-b from-white to-[#f8f9fc] shadow-[0_16px_40px_-32px_rgba(15,23,42,.5)] sm:mt-14">
      <div className="grid grid-cols-3 divide-x divide-line">
        {items.map((s) => (
          <Stat key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
}
