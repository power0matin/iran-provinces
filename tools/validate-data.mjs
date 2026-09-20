import { existsSync, readFileSync, readdirSync } from "node:fs";
import { buildSitemap } from "./build-sitemap.mjs";

const read = (path) => readFileSync(path, "utf8");
const readJson = (path) => JSON.parse(read(path));
const errors = [];
const warnings = [];

const { provinces } = readJson("data/provinces/index.json");
const slugMap = readJson("data/provinces/slug-map.json");
const geo = readJson("data/geo/iran-provinces.geojson");

const required = [
  "id",
  "nameFa",
  "nameEn",
  "capital",
  "capitalEn",
  "intro",
  "introEn",
  "population",
  "areaKm2",
  "hero",
];
const ids = new Set(provinces.map((province) => province.id));

if (provinces.length !== 31) errors.push(`index.json has ${provinces.length} provinces, expected 31`);
if (ids.size !== provinces.length) errors.push("index.json contains duplicate ids");
for (const province of provinces) {
  for (const key of required) {
    if (province[key] == null || province[key] === "") errors.push(`${province.id}: missing "${key}"`);
  }
}

const mappedIds = new Set(slugMap.map((entry) => entry.id));
if (slugMap.length !== provinces.length) errors.push(`slug-map.json has ${slugMap.length} entries`);
for (const entry of slugMap) {
  if (!ids.has(entry.id)) errors.push(`slug-map.json: unknown id "${entry.id}"`);
}
for (const id of ids) {
  if (!mappedIds.has(id)) errors.push(`slug-map.json: no entry for "${id}"`);
}

const featureIds = new Set();
for (const feature of geo.features) {
  const { id, nameFa, NAME_1: name } = feature.properties;
  if (!ids.has(id)) errors.push(`geojson: "${name}" has unknown id "${id}"`);
  if (featureIds.has(id)) errors.push(`geojson: duplicate id "${id}"`);
  featureIds.add(id);
  const province = provinces.find((item) => item.id === id);
  if (province && province.nameFa !== nameFa) errors.push(`geojson: nameFa mismatch for "${id}"`);
}
if (geo.features.length !== provinces.length) errors.push(`geojson has ${geo.features.length} features`);

const JPEG_MAGIC = [0xff, 0xd8, 0xff];
for (const province of provinces) {
  if (!existsSync(province.hero)) {
    warnings.push(`${province.id}: hero image missing (${province.hero})`);
    continue;
  }
  const head = readFileSync(province.hero).subarray(0, 3);
  if (province.hero.endsWith(".jpg") && !JPEG_MAGIC.every((byte, i) => head[i] === byte)) {
    errors.push(`${province.hero}: .jpg extension but not JPEG data`);
  }
}

const dictSource = read("js/i18n.js");
const enStart = dictSource.indexOf("    en: {");
const keysOf = (source) => new Set([...source.matchAll(/"([\w.]+)"\s*:/g)].map((match) => match[1]));
const faKeys = keysOf(dictSource.slice(0, enStart));
const enKeys = keysOf(dictSource.slice(enStart));
const usedKeys = new Set();
for (const file of readdirSync(".").filter((name) => name.endsWith(".html"))) {
  const html = read(file);
  for (const match of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)) {
    usedKeys.add(match[1]);
    if (!faKeys.has(match[1])) errors.push(`${file}: i18n key "${match[1]}" missing in fa`);
    if (!enKeys.has(match[1])) errors.push(`${file}: i18n key "${match[1]}" missing in en`);
  }
}

let sitemapCurrent = "";
try {
  sitemapCurrent = read("sitemap.xml");
} catch {}
if (sitemapCurrent !== buildSitemap()) errors.push("sitemap.xml is out of date (node tools/build-sitemap.mjs)");

warnings.forEach((message) => console.warn(`warn  ${message}`));
errors.forEach((message) => console.error(`error ${message}`));
console.log(
  `${provinces.length} provinces, ${geo.features.length} map features, ${usedKeys.size} i18n keys checked: ${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length ? 1 : 0);
