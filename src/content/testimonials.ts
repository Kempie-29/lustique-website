/**
 * Testimonials. Intentionally EMPTY in Phase 1 — no verified bride reviews have
 * been supplied, and none will be invented. The Home testimonial section is
 * hidden while this array is empty.
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  context?: string;
  rating: number;
}

export const testimonials: Testimonial[] = [];