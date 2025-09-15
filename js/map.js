/* Leaflet interactive map with real zoom/pan + province polygons
 * Dependencies: Leaflet (CDN), darkMode.js (theme), i18n.js (lang)
 *
 * Data:
 *  - GeoJSON: data/geo/iran-provinces.geojson
 *      Feature.properties must include:
 *        - id        (slug, e.g. "tehran")
 *        - nameFa
 *        - nameEn
 *        - (optional) center: [lat, lng] | centroid computed
 *
 *  - Your existing province index (optional for cross-check):
 *      data/provinces/index.json  -> { provinces: [ { id, nameFa, nameEn, ... } ] }
 */

(function () {
  const $status = document.getElementById("mapStatus");
  const $tooltip = document.getElementById("mapTooltip");

  // Iran approximate bounds (to limit panning hard out of the area)
  const IRAN_BOUNDS = L.latLngBounds([24, 43], [40.5, 64.5]);
  const IRAN_CENTER = [32.5, 53.5];
  const START_ZOOM = 4.8;

  // Base tiles (light/dark). Use free public providers with attribution.
  const tilesLight = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
      minZoom: 3,
      maxZoom: 10,
      className: "light-tiles",
    }
  );

  // CARTO Dark Matter (no key). If ever blocked, swap to another dark provider.
  const tilesDark = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://carto.com/attributions">CARTO</a> | &copy; OSM',
      minZoom: 3,
      maxZoom: 10,
      className: "dark-tiles",
    }
  );

  // Create map
  const map = L.map("map", {
    center: IRAN_CENTER,
    zoom: START_ZOOM,
    maxBounds: IRAN_BOUNDS.pad(0.2),
    worldCopyJump: false,
    zoomControl: true,
    attributionControl: true,
  });

  // Decide initial theme
  const root = document.documentElement;
  const getTheme = () =>
    root.getAttribute("data-theme") ||
    (root.classList.contains("theme-auto") ? "auto" : "dark");

  // Attach base layer per theme
  let currentBase = null;
  function applyBaseTiles() {
    const theme = getTheme();
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "dark" || (theme === "auto" && prefersDark);

    if (currentBase) map.removeLayer(currentBase);
    currentBase = dark ? tilesDark : tilesLight;
    currentBase.addTo(map);
  }
  applyBaseTiles();

  // React to theme changes (darkMode.js should dispatch a custom event)
  window.addEventListener("themechange", applyBaseTiles);

  // Tooltip helpers
  function showTooltip(latlng, label) {
    if (!$tooltip) return;
    const pt = map.latLngToContainerPoint(latlng);
    $tooltip.textContent = label;
    $tooltip.style.left = `${pt.x}px`;
    $tooltip.style.top = `${pt.y}px`;
    $tooltip.classList.add("show");
    $tooltip.setAttribute("aria-hidden", "false");
  }
  function hideTooltip() {
    if (!$tooltip) return;
    $tooltip.classList.remove("show");
    $tooltip.setAttribute("aria-hidden", "true");
  }

  // Province layer
  let provincesLayer = null;

  // i18n: use FA for rtl, EN for ltr
  function getLang() {
    return document.documentElement.getAttribute("lang") || "fa";
  }
  function provinceLabel(props) {
    return getLang().startsWith("fa")
      ? props.nameFa || props.nameEn
      : props.nameEn || props.nameFa;
  }

  // Style + interaction
  function defaultStyle() {
    return {
      color:
        getComputedStyle(document.documentElement).getPropertyValue(
          "--border"
        ) || "#334",
      weight: 1,
      fillColor: "rgba(124, 92, 255, .12)",
      fillOpacity: 0.8,
    };
  }

  function onEachFeature(feature, layer) {
    // mark for CSS targeting
    layer
      .getElement?.()
      ?.setAttribute?.("data-province", feature?.properties?.id || "");

    layer.on("mouseover", (e) => {
      const el = e.target.getElement ? e.target.getElement() : null;
      if (el) el.classList.add("hovered");
      const center = e.latlng || e.target.getBounds().getCenter();
      showTooltip(center, provinceLabel(feature.properties));
    });

    layer.on("mousemove", (e) => {
      showTooltip(e.latlng, provinceLabel(feature.properties));
    });

    layer.on("mouseout", (e) => {
      const el = e.target.getElement ? e.target.getElement() : null;
      if (el) el.classList.remove("hovered");
      hideTooltip();
    });

    layer.on("click", () => {
      const id = feature?.properties?.id;
      if (id) {
        window.location.href = `province.html?id=${encodeURIComponent(id)}`;
      }
    });

    // Focus ring for keyboard nav (optional)
    layer.on("keydown", (e) => {
      if (e.originalEvent.key === "Enter") {
        const id = feature?.properties?.id;
        if (id)
          window.location.href = `province.html?id=${encodeURIComponent(id)}`;
      }
    });
  }

  async function loadProvinces() {
    try {
      $status && ($status.textContent = "Loading…");

      // Load the GeoJSON (province boundaries)
      const res = await fetch("data/geo/iran-provinces.geojson", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`GeoJSON HTTP ${res.status}`);
      const geo = await res.json();

      // Optional cross-check with your data index (to ensure IDs exist)
      // const idx = await (await fetch('data/provinces/index.json', { cache: 'no-store' })).json();

      provincesLayer = L.geoJSON(geo, {
        style: defaultStyle,
        onEachFeature,
      }).addTo(map);

      // Fit bounds neatly (once)
      try {
        map.fitBounds(provincesLayer.getBounds().pad(0.05));
      } catch {
        /* ignore if invalid bounds */
      }

      $status && ($status.textContent = "Ready");
    } catch (err) {
      console.error(err);
      if ($status) {
        $status.textContent = "Failed to load";
        $status.classList.add("badge-error");
      }
    }
  }

  loadProvinces();

  // Re-render labels when language changes
  window.addEventListener("langchange", () => {
    // Just force-hide tooltip to avoid stale text; next hover shows correct lang
    hideTooltip();
  });
})();
