/**
 * Portfolio gallery. Intentionally EMPTY in Phase 1 — real photography has not
 * been supplied yet, so nothing is fabricated. Cards render an elegant monogram
 * placeholder until photos are added here.
 */

export interface GalleryItem {
  id: string;
  title: string;
  category: "Bridal" | "Party" | "Editorial";
  /** Artist id from `content/artists.ts` — the portfolio filters by artist only. */
  artist?: string;
  imageUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

export const gallery: GalleryItem[] = [];

export const galleryCategories = ["All", "Bridal", "Party", "Editorial"] as const;