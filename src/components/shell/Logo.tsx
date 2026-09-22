import { useState } from "react";

type LogoVariant = "emblem" | "full";

interface LogoProps {
  /** "emblem" = tight square crop (header, icons); "full" = emblem + wordmark lockup. */
  variant?: LogoVariant;
  /** Render on an ivory plate so the mark stays legible on dark surfaces. */
  onDark?: boolean;
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
 *
 * The raster is a white-ground JPG, so the "emblem" crop is framed by its own
 * white plate on light surfaces, and switches to an ivory plate on dark ones.
 * A transparent, high-resolution export is the ideal — this composition keeps
 * the site correct until that arrives.
 */
const SOURCES = ["/assets/lustique-logo.jpeg", "/assets/logo.svg"];

export function Logo({ variant = "emblem", onDark = false, className = "", alt = "Lustique Co." }: LogoProps) {
  const [index, setIndex] = useState(0);
  const src = SOURCES[index];
  const classes = ["logo", `logo--${variant}`, onDark ? "logo--on-dark" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        onError={() => setIndex((i) => (i < SOURCES.length - 1 ? i + 1 : i))}
      />
    </span>
  );
}
