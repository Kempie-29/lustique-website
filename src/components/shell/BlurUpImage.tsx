import { useState } from "react";

interface BlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
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
}: BlurUpImageProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  const stateClass = state === "loaded" ? "loaded" : state === "error" ? "img-error" : "";

  return (
    <span className={`ph ${stateClass} ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </span>
  );
}