const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';

const grainUrl = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** Subtle fixed film-grain texture. Decorative only. */
export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" style={{ backgroundImage: grainUrl }} />;
}