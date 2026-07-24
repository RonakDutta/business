/*
  A single shimmering placeholder block. Size + shape via className
  (e.g. <Skeleton className="h-4 w-32 rounded-full" />). The shimmer itself is
  the `.skeleton` utility in index.css (and it flattens under reduced-motion).
*/
export default function Skeleton({ className = "" }) {
  return (
    <span aria-hidden="true" className={`skeleton block rounded-md ${className}`} />
  );
}
