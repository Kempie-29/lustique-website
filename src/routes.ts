/**
 * Route manifest — the single source of truth for which routes are public
 * (indexable) and which are private (noindex + disallowed in robots.txt), plus
 * their default SEO metadata. Consumed by the app (Seo.tsx, route guards) and by
 * `scripts/generate-sitemap.mjs`, so the sitemap and the markup can never drift.
 */
import manifest from "./routes.json";

export interface PublicRoute {
  path: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: string;
}

export interface DynamicRoute {
  prefix: string;
  source: string;
  title: string;
  priority: number;
  changeFrequency: string;
}

export const ogImage: string = manifest.ogImage;
export const publicRoutes = manifest.public as PublicRoute[];
export const privateRoutes: string[] = manifest.private;
export const dynamicRoutes = manifest.dynamic as DynamicRoute[];

/** Exact-match lookup for a static public route. */
export function findPublicRoute(path: string): PublicRoute | undefined {
  return publicRoutes.find((route) => route.path === path);
}

/** True when a path (or anything beneath it) is an account/transactional route. */
export function isPrivatePath(path: string): boolean {
  return privateRoutes.some((base) => path === base || path.startsWith(`${base}/`));
}

/** The dynamic entry (guides/journal) a path belongs to, if any. */
export function findDynamicRoute(path: string): DynamicRoute | undefined {
  return dynamicRoutes.find((route) => path.startsWith(route.prefix));
}