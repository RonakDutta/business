import CountUp from "./CountUp.jsx";

function Stat({ value, suffix, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-3 py-7 text-center sm:px-4 sm:py-9 md:py-11">
      {/* tabular-nums keeps every digit the same width, so the number does not
          jitter while it counts up. */}
      <div className="text-[26px] font-extrabold tabular-nums leading-none tracking-[-0.03em] text-accent sm:text-[36px] md:text-[44px]">
        <CountUp
          from={0}
          to={value}
          duration={1.2}
          separator=","
        />
        {suffix}
      </div>

      <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-subtle sm:text-[11px] sm:tracking-[0.1em] md:text-xs">
        {label}
      </div>
    </div>
  );
}

export default function Stats({ items }) {
  return (
    <div className="reveal clay mt-14 overflow-hidden rounded-panel bg-white sm:mt-16">
      <div className="grid grid-cols-3 divide-x divide-line">
        {items.map((item) => (
          <Stat key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
