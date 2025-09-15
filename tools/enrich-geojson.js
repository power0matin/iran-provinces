// node tools/enrich-geojson.js
import fs from "node:fs";

const geo = JSON.parse(
  fs.readFileSync("data/geo/iran-provinces.geojson", "utf8")
);
const map = JSON.parse(fs.readFileSync("data/provinces/slug-map.json", "utf8"));
// slug-map.json: [{ "matchEn": "Tehran", "id": "tehran", "nameFa":"تهران", "nameEn":"Tehran" }, ...]

for (const f of geo.features) {
  const n = (f.properties.NAME_1 || f.properties.name_en || "").trim();
  const hit = map.find((m) => m.matchEn.toLowerCase() === n.toLowerCase());
  if (hit)
    Object.assign(f.properties, {
      id: hit.id,
      nameFa: hit.nameFa,
      nameEn: hit.nameEn,
    });
}
fs.writeFileSync("data/geo/iran-provinces.geojson", JSON.stringify(geo));
console.log("Enriched GeoJSON saved.");
