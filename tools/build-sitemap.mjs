import { readFileSync, writeFileSync } from "node:fs";

const SITE_URL = "https://power0matin.github.io/iran-provinces/";
const INDEX_PATH = "data/provinces/index.json";
const OUTPUT_PATH = "sitemap.xml";

export function buildSitemap() {
  const { provinces, lastUpdated } = JSON.parse(readFileSync(INDEX_PATH, "utf8"));

  const urls = [
    { loc: SITE_URL, priority: "1.0" },
    { loc: `${SITE_URL}about.html`, priority: "0.5" },
    { loc: `${SITE_URL}contact.html`, priority: "0.4" },
    ...provinces.map((province) => ({
      loc: `${SITE_URL}province.html?id=${encodeURIComponent(province.id)}`,
      priority: "0.8",
    })),
  ];

  const entries = urls
    .map(
      ({ loc, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastUpdated}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

if (process.argv[1]?.endsWith("build-sitemap.mjs")) {
  const xml = buildSitemap();

  if (process.argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(OUTPUT_PATH, "utf8");
    } catch {}
    if (current !== xml) {
      console.error(`${OUTPUT_PATH} is out of date. Run: node tools/build-sitemap.mjs`);
      process.exit(1);
    }
    console.log(`${OUTPUT_PATH} is up to date.`);
  } else {
    writeFileSync(OUTPUT_PATH, xml);
    console.log(`Wrote ${OUTPUT_PATH}`);
  }
}
