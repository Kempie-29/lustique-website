/**
 * Generates public/sitemap.xml from the route manifest (src/routes.json).
 *
 * Single source of truth: static routes and their priorities come from the
 * manifest; dynamic routes (guides, journal) are enumerated from their content
 * files. Private/noindex routes are never emitted. Run with `npm run sitemap`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFileSync(resolve(root, relative), "utf8");

const manifest = JSON.parse(read("src/routes.json"));

const siteMatch = read("src/content/site.ts").match(/url:\s*"([^"]+)"/);
if (!siteMatch) throw new Error("Could not read site url from src/content/site.ts");
const siteUrl = siteMatch[1].replace(/\/$/, "");

const entries = [];

for (const route of manifest.public) {
  entries.push({
    loc: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  });
}

for (const dynamic of manifest.dynamic) {
  const source = read(dynamic.source);
  const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  for (const slug of slugs) {
    entries.push({
      loc: `${siteUrl}${dynamic.prefix}${slug}`,
      changeFrequency: dynamic.changeFrequency,
      priority: dynamic.priority,
    });
  }
}

const lastmod = new Date().toISOString().slice(0, 10);

const urls = entries
  .map((entry) =>
    [
      "  <url>",
      `    <loc>${entry.loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${entry.changeFrequency}</changefreq>`,
      `    <priority>${entry.priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n"),
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(resolve(root, "public/sitemap.xml"), xml);
// eslint-disable-next-line no-console
console.log(`sitemap.xml written with ${entries.length} URLs`);