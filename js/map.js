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
  const tooltip = $("#mapTooltip");

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

  function nameFor(props) {
    const lang = document.documentElement.lang || "fa";
    return lang === "fa"
      ? props.nameFa || props.NAME_1
      : props.nameEn || props.name_en || props.NAME_1;
  }

  function navigateTo(props) {
    if (!props?.id) return;
    const url = `province.html?id=${encodeURIComponent(props.id)}`;
    window.location.href = url;
  }

  function wireInteractions(layer, feature) {
    const props = feature.properties || {};

    layer.on("mouseover", (e) => {
      layer.setStyle(hoverStyle);
      el.style.cursor = "pointer";
      if (tooltip) {
        tooltip.textContent = nameFor(props);
        tooltip.style.opacity = "1";
        tooltip.setAttribute("aria-hidden", "false");
      }
    });

    layer.on("mouseout", () => {
      geojson.resetStyle(layer);
      el.style.cursor = "";
      if (tooltip) {
        tooltip.style.opacity = "0";
        tooltip.setAttribute("aria-hidden", "true");
      }
    });

    layer.on("mousemove", (e) => {
      if (!tooltip) return;
      const pad = 12;
      tooltip.style.left = `${e.originalEvent.clientX + pad}px`;
      tooltip.style.top = `${e.originalEvent.clientY + pad}px`;
    });

    layer.on("click", () => navigateTo(props));
    layer.on("keypress", (e) => {
      if (e.originalEvent.key === "Enter" || e.originalEvent.key === " ")
        navigateTo(props);
    });

    // A11y focusable path
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
