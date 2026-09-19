interface MonogramProps {
  /** Text shown inside the roundel — defaults to the Lustique "LC" mark. */
  mark?: string;
  className?: string;
}

/** Elegant placeholder used wherever a real photo has not been supplied yet. */
export function Monogram({ mark = "LC", className = "" }: MonogramProps) {
  return (
    <div className={`monogram ${className}`.trim()} aria-hidden="true">
      <span className="monogram__mark">{mark}</span>
    </div>
  );
}