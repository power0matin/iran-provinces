// map.js – Mobile-solid Leaflet init with theme + fallback + reflow guards
(function () {
  const el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;

  // Choose a provider set: light/dark + a plain OSM fallback
  const providers = {
    light: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
    },
    dark: {
      // Dark-friendly tiles (CartoDB DarkMatter)
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attr:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> ' +
        'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    fallback: {
      // Humanitarian style as a second attempt if we get repeated tileerror
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attr: '&copy; OSM & <a href="https://www.openstreetmap.fr/">OSM France</a>',
    },
  };

  function resolvedTheme() {
    // data-theme="dark"|"light" set by your darkMode.js
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  // Ensure container has a workable height (CSS sets it, this is just a guard)
  function ensureHeight() {
    const min = 280; // final guard
    if (el.offsetHeight < min) {
      el.style.minHeight = min + "px";
    }
  }

  ensureHeight();

  // Init map
  const map = L.map(el, {
    zoomControl: true,
    attributionControl: true,
  });

  // Iran centroid
  map.setView([32.4279, 53.688], 5);

  // Tile layer with error-based fallback + theme switch
  let currentLayer;
  let errorCount = 0;

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

  function onTileError() {
    // after a few errors swap to fallback once
    errorCount++;
    if (errorCount === 4) {
      useLayer("fallback");
    }
  }

  // initial layer based on theme
  useLayer(resolvedTheme() === "dark" ? "dark" : "light");

  // switch tiles when theme changes
  window.addEventListener("themechange", (e) => {
    const resolved = e.detail?.resolved || "light";
    errorCount = 0;
    useLayer(resolved === "dark" ? "dark" : "light");
    // Give the browser a tick to paint, then fix layout
    requestAnimationFrame(() => map.invalidateSize());
  });

  // Reflow guards: phone rotations, drawer open/close, tab switches
  const invalidate = () => map.invalidateSize(true);
  window.addEventListener("resize", () => setTimeout(invalidate, 120));
  window.addEventListener("orientationchange", () =>
    setTimeout(invalidate, 180)
  );
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setTimeout(invalidate, 100);
  });

  // If your map is inside a tab/panel that toggles, observe visibility
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((it) => {
        if (it.isIntersecting) setTimeout(invalidate, 80);
      });
    },
    { threshold: 0.2 }
  );
  io.observe(el);

  // Optional: smoother scroll on iOS
  el.style.webkitOverflowScrolling = "touch";
})();
