import CountUp from "./CountUp.jsx";

// Three headline numbers in one strip. A <dl> needs the label (<dt>) before
// the value (<dd>), so `order` is what puts the number on top visually.
export default function Stats({ items }) {
  return (
    <dl className="reveal mt-14 grid grid-cols-3 divide-x divide-line rounded-card border border-line bg-white shadow-card sm:mt-16">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center px-2 py-7 text-center sm:py-10"
        >
          <dt className="order-2 mt-1.5 text-[12.5px] leading-snug text-subtle sm:text-[14.5px]">
            {item.label}
          </dt>
          {/* tabular-nums keeps every digit the same width, so the number
              does not jitter while it counts up. */}
          <dd className="order-1 font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums sm:text-[40px] lg:text-[46px]">
            <CountUp from={0} to={item.value} duration={1.1} separator="," />
            {item.suffix}
          </dd>
        </div>
      ))}
    </dl>
  );
}
