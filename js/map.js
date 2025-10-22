// js/map.js – Leaflet init + GeoJSON with hover/click navigation
(function () {
  const el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;

  const $ = (s, r = document) => r.querySelector(s);

  // --- providers / theme (همان کد قبلی شما) ---
  const providers = {
    light: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attr:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> ' +
        'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    fallback: {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attr: '&copy; OSM & <a href="https://www.openstreetmap.fr/">OSM France</a>',
    },
  };
  const resolvedTheme = () =>
    document.documentElement.getAttribute("data-theme") || "light";

  function ensureHeight() {
    const min = 280;
    if (el.offsetHeight < min) el.style.minHeight = min + "px";
  }
  ensureHeight();

  // --- init map ---
  const map = L.map(el, { zoomControl: true, attributionControl: true });
  map.setView([32.4279, 53.688], 5);

  // --- tiles with fallback + theme switch ---
  let currentLayer,
    errorCount = 0;
  function onTileError() {
    if (++errorCount === 4) useLayer("fallback");
  }
  function useLayer(kind) {
    if (currentLayer) {
      currentLayer.off("tileerror", onTileError);
      currentLayer.remove();
    }
    const p = providers[kind] || providers.light;
    currentLayer = L.tileLayer(p.url, {
      attribution: p.attr,
      detectRetina: window.devicePixelRatio > 1,
      crossOrigin: true,
    }).addTo(map);
    currentLayer.on("tileerror", onTileError);
  }
  useLayer(resolvedTheme() === "dark" ? "dark" : "light");
  window.addEventListener("themechange", (e) => {
    errorCount = 0;
    const t = e.detail?.resolved || "light";
    useLayer(t === "dark" ? "dark" : "light");
    requestAnimationFrame(() => map.invalidateSize());
  });
  // --- reflow guards (همان کد قبلی) ---
  const invalidate = () => map.invalidateSize(true);
  window.addEventListener("resize", () => setTimeout(invalidate, 120));
  window.addEventListener("orientationchange", () =>
    setTimeout(invalidate, 180)
  );
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setTimeout(invalidate, 100);
  });
  const io = new IntersectionObserver(
    (es) => es.forEach((it) => it.isIntersecting && setTimeout(invalidate, 80)),
    { threshold: 0.2 }
  );
  io.observe(el);
  el.style.webkitOverflowScrolling = "touch";

  // ==============================
  //        GeoJSON LAYER
  // ==============================
  const status = $("#mapStatus");

  const fill =
    getComputedStyle(document.documentElement).getPropertyValue("--primary") ||
    "#6d28d9";
  const normalStyle = {
    color: "rgba(0,0,0,.25)",
    weight: 1,
    fillColor: fill.trim(),
    fillOpacity: 0.08,
  };
  const hoverStyle = { weight: 2, fillOpacity: 0.18 };

  function _neatEN(s) {
    if (!s) return "";
    s = String(s).replace(/[_-]+/g, " ");
    s = s.replace(/([a-z])([A-Z])/g, "$1 $2");
    return s.replace(/\s{2,}/g, " ").trim();
  }
  function nameFor(props) {
    if (props.nameFa) return props.nameFa;
    return _neatEN(props.nameEn || props.name_en || props.NAME_1 || "");
  }

  function navigateTo(props) {
    if (!props?.id) return;
    const url = `province.html?id=${encodeURIComponent(props.id)}`;
    window.location.href = url;
  }

  function wireInteractions(layer, feature) {
    const props = feature.properties || {};
    const label = nameFor(props);

    layer.bindTooltip(label, {
      direction: "top",
      sticky: false, // به موس نچسبد
      permanent: false,
      opacity: 1,
      offset: L.point(0, -10), // کمی بالاتر
      className: "prov-tip",
    });

    function _ringCentroidArea(coords) {
      let twiceArea = 0,
        cx = 0,
        cy = 0;
      const closed =
        coords.length > 1 &&
        coords[0][0] === coords[coords.length - 1][0] &&
        coords[0][1] === coords[coords.length - 1][1];
      const n = coords.length - (closed ? 1 : 0);

      for (let i = 0; i < n; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[(i + 1) % n];
        const cross = x1 * y2 - x2 * y1;
        twiceArea += cross;
        cx += (x1 + x2) * cross;
        cy += (y1 + y2) * cross;
      }
      const A = twiceArea / 2;
      if (A === 0) return { x: coords[0][0], y: coords[0][1], area: 0 };
      return {
        x: cx / (3 * twiceArea),
        y: cy / (3 * twiceArea),
        area: Math.abs(A),
      };
    }

    function featureCenterLatLng(feature) {
      const geom = feature && feature.geometry;
      if (!geom) return null;

      if (geom.type === "Polygon") {
        const { x, y } = _ringCentroidArea(geom.coordinates[0]);
        return L.latLng(y, x);
      }
      if (geom.type === "MultiPolygon") {
        let best = null;
        for (const poly of geom.coordinates) {
          const c = _ringCentroidArea(poly[0]);
          if (!best || c.area > best.area) best = c;
        }
        if (best) return L.latLng(best.y, best.x);
      }
      return null;
    }

    // اگر لایه center نداشت، از مرکز «هندسی» فیچر استفاده کن و در نهایت fallback به bounds
    function centerOf(layer, feature) {
      if (layer && typeof layer.getCenter === "function") {
        try {
          return layer.getCenter();
        } catch (e) {
          /* fallback */
        }
      }
      const c = featureCenterLatLng(feature);
      return c || layer.getBounds().getCenter();
    }

    const show = () => {
      layer.setStyle(hoverStyle);
      layer.openTooltip(centerOf(layer, feature)); // ← مرکز دقیق‌تر
      layer.bringToFront?.();
    };

    layer.on("mousemove", () => {
      // اگر استان کشیده است، جای تولتیپ را روی همان مرکز نگه دار
      const tip = layer.getTooltip();
      if (tip && tip.isOpen()) tip.setLatLng(centerOf(layer, feature));
    });

    const hide = () => {
      geojson.resetStyle(layer);
      layer.closeTooltip();
    };

    layer.on("mouseover", show);

    layer.on("mousemove", () => {
      const tip = layer.getTooltip();
      if (tip && tip.isOpen()) tip.setLatLng(centerOf(layer, feature));
    });

    layer.on("mouseout", hide);

    layer.on("click", () => navigateTo(props));
    layer.on("keypress", (e) => {
      if (e.originalEvent.key === "Enter" || e.originalEvent.key === " ")
        navigateTo(props);
    });

    if (layer.getElement) {
      requestAnimationFrame(() => {
        const path = layer.getElement();
        if (path) {
          path.setAttribute("tabindex", "0");
          path.setAttribute("role", "link");
        }
      });
    }
  }

  let geojson;
  async function loadGeo() {
    try {
      status && (status.textContent = "Loading…");
      const res = await fetch("data/geo/iran-provinces.geojson", {
        cache: "no-store",
      });
      const data = await res.json();

      geojson = L.geoJSON(data, {
        style: () => normalStyle,
        onEachFeature: (feature, layer) => wireInteractions(layer, feature),
      }).addTo(map);

      status && (status.textContent = "✓");
    } catch (err) {
      console.error("GeoJSON load error:", err);
      status && (status.textContent = "Error");
    }
  }

  // re-render names when language changes (tooltip content)
  window.addEventListener("langchange", () => {
    // فقط تولتیپ و کپشن‌ها به زبان جدید می‌روند؛ نیازی به باز-ساخت لایه نیست.
  });

  loadGeo();
})();
