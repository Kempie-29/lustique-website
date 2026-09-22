import { useState } from "react";

type BlurUpVariant = "plain" | "curtain";

interface BlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  /**
   * "curtain" masks the photo behind a panel that lifts as the image settles —
   * used for hero and feature imagery. "plain" (default) is the blur-up only.
   */
  variant?: BlurUpVariant;
  /** Barely-there Ken Burns drift once the image is loaded. */
  kenBurns?: boolean;
  /** Intrinsic dimensions to reserve space and avoid layout shift. */
  width?: number;
  height?: number;
}

/**
 * Progressive (blur-up) image. The `html.js` gate in `main.tsx` hides the photo
 * until it has actually loaded, so a slow network never shows a blank frame —
 * mirrors the live `.ph` decoration.
 */
export function BlurUpImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  fetchPriority,
  variant = "plain",
  kenBurns = false,
  width,
  height,
}: BlurUpImageProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  const stateClass = state === "loaded" ? "loaded" : state === "error" ? "img-error" : "";
  const classes = [
    "ph",
    variant === "curtain" ? "ph--curtain" : "",
    kenBurns ? "ph--kenburns" : "",
    stateClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </span>
  );
}
