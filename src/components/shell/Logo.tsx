import { useState } from "react";

type LogoVariant = "emblem" | "full";

interface LogoProps {
  /** "emblem" = tight square mark (header, icons); "full" = emblem + wordmark lockup. */
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
 * Sources are ordered per variant so each placement gets the sharpest asset for
 * its size:
 * - `emblem` (the ~46 px header mark) leads with the crisp vector monogram.
 *   The installed raster is a compressed, white-ground lockup — a square crop
 *   of it contains the fine "LUSTIQUE / Cosmetology" wordmark, which is only a
 *   few pixels tall at that size and reads as blur. The vector stays sharp at
 *   any DPI.
 * - `full` (footer, dashboard, sign-in) leads with the raster lockup, which
 *   renders legibly at 54–66 px.
 *
 * Each list degrades to the next source on error, so a missing asset never
 * renders a broken image. A transparent, high-resolution lockup export remains
 * the ideal — dropping one in needs no markup change.
 */
const SOURCES: Record<LogoVariant, string[]> = {
  emblem: ["/assets/logo.svg", "/assets/lustique-logo.jpeg"],
  full: ["/assets/lustique-logo.jpeg", "/assets/logo.svg"],
};

export function Logo({ variant = "emblem", onDark = false, className = "", alt = "Lustique Co." }: LogoProps) {
  const [index, setIndex] = useState(0);
  const sources = SOURCES[variant];
  const src = sources[Math.min(index, sources.length - 1)];
  const classes = ["logo", `logo--${variant}`, onDark ? "logo--on-dark" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        onError={() => setIndex((i) => (i < sources.length - 1 ? i + 1 : i))}
      />
    </span>
  );
}