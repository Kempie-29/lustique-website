import { useState } from "react";

type LogoVariant = "emblem" | "full";

interface LogoProps {
  /** "emblem" = compact square mark (header, favicon contexts); "full" = lockup. */
  variant?: LogoVariant;
  className?: string;
  /** Pass an empty string for purely decorative placements. */
  alt?: string;
}

/**
 * The official Lustique Co. mark.
 *
 * Prefers the installed brand asset (`/assets/lustique-logo.jpeg`) and degrades
 * gracefully: real logo file → vector monogram → the wordmark beside it still
 * carries the brand. A missing asset never renders a broken image.
 */
const SOURCES = ["/assets/lustique-logo.jpeg", "/assets/logo.svg"];

export function Logo({ variant = "emblem", className = "", alt = "Lustique Co." }: LogoProps) {
  const [index, setIndex] = useState(0);
  const src = SOURCES[index];

  return (
    <img
      className={`logo logo--${variant} ${className}`.trim()}
      src={src}
      alt={alt}
      width={variant === "full" ? 210 : 44}
      height={variant === "full" ? 64 : 44}
      decoding="async"
      onError={() => setIndex((i) => (i < SOURCES.length - 1 ? i + 1 : i))}
    />
  );
}