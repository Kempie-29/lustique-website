import { Star } from "lucide-react";

interface StarRowProps {
  /** Filled stars out of five. */
  value?: number;
  label?: string;
  className?: string;
}

export function StarRow({ value = 5, label, className = "" }: StarRowProps) {
  return (
    <span className={`star-row ${className}`.trim()} role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden="true" fill={i < value ? "currentColor" : "none"} stroke="currentColor" />
      ))}
      {label ? <span className="star-row__label">{label}</span> : null}
    </span>
  );
}