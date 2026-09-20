import { useEffect } from "react";
import { site } from "@/content/site";
import { findPublicRoute, isPrivatePath, ogImage } from "@/routes";

interface SeoProps {
  /** Optional override — otherwise the route manifest supplies the title. */
  title?: string;
  /** Optional override — otherwise the route manifest supplies the description. */
  description?: string;
  path: string;
  /** Thank-you and other transient pages set this to true. */
  noindex?: boolean;
  /** Path to a specific share image, e.g. a gallery photo. */
  image?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function absolute(path: string) {
  return path.startsWith("http") ? path : `${site.url}${path}`;
}

/**
 * Per-route document head. Manifest-driven: titles, descriptions and the
 * default share image come from `src/routes.json`, and private routes are
 * automatically marked noindex. The static prerender pass (Phase 5) bakes the
 * same values into HTML so crawlers never depend on runtime JS.
 */
export function Seo({ title, description, path, noindex, image }: SeoProps) {
  useEffect(() => {
    const route = findPublicRoute(path);
    const resolvedTitle = title ?? route?.title ?? site.name;
    const resolvedDescription = description ?? route?.description ?? site.shortDescription;
    const fullTitle = resolvedTitle.includes(site.name) ? resolvedTitle : `${resolvedTitle} — ${site.name}`;
    const url = `${site.url}${path}`;
    const shareImage = absolute(image ?? ogImage);
    const isPrivate = noindex ?? isPrivatePath(path);

    document.title = fullTitle;
    upsertMeta("name", "description", resolvedDescription);
    upsertMeta("name", "robots", isPrivate ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", site.name);
    upsertMeta("property", "og:locale", "en_ZA");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", resolvedDescription);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", shareImage);
    upsertMeta("property", "og:image:alt", `${site.name} — ${site.tagline}`);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", resolvedDescription);
    upsertMeta("name", "twitter:image", shareImage);
  }, [title, description, path, noindex, image]);

  return null;
}