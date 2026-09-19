import { useEffect } from "react";
import { site } from "@/content/site";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  /** Thank-you and other transient pages set this to true. */
  noindex?: boolean;
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

/** Per-route document head. Runtime-managed in Phase 1 (no prerender yet). */
export function Seo({ title, description, path, noindex = false, image }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(site.name) ? title : `${title} — ${site.name}`;
    const url = `${site.url}${path}`;
    const ogImage = image ? `${site.url}${image}` : `${site.url}/assets/logo.svg`;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", site.name);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", ogImage);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);
  }, [title, description, path, noindex, image]);

  return null;
}