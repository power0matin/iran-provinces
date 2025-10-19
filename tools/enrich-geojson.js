// node tools/enrich-geojson.js
import fs from "node:fs";

const GEO_PATH = "data/geo/iran-provinces.geojson"; // GeoJSON مرجع مرزها
const MAP_PATH = "data/provinces/slug-map.json"; // جدول بالا

const geo = JSON.parse(fs.readFileSync(GEO_PATH, "utf8"));
const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));

const nameKeys = ["NAME_1", "NAME_EN", "name_en", "prov_name", "NAME"]; // کلیدهای احتمالی نام EN در فایل شما
const misses = [];

for (const f of geo.features || []) {
  const props = f.properties || {};
  const nameEn =
    nameKeys.map((k) => (props[k] || "").toString().trim()).find(Boolean) || "";

  const hit = map.find((m) => m.matchEn.toLowerCase() === nameEn.toLowerCase());

  if (!hit) {
    misses.push(nameEn || "(empty)");
    continue;
  }

  Object.assign(props, { id: hit.id, nameFa: hit.nameFa, nameEn: hit.nameEn });
  f.properties = props;
}

// اعتبارسنجی: 31 استان؟
if ((geo.features || []).length !== 31) {
  console.warn("⚠️ Feature count != 31:", geo.features?.length);
}

// گزارش
if (misses.length) {
  console.warn("⚠️ Unmatched names in GeoJSON:", misses);
}

fs.writeFileSync(
  GEO_PATH,
  JSON.stringify(
    {
      type: "FeatureCollection",
      name: "iran-provinces",
      features: geo.features,
    },
    null,
    2
  )
);

console.log("✓ Enriched:", GEO_PATH, "→ features now have {id,nameFa,nameEn}");
