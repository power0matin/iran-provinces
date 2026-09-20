// darkMode.js — persistent theme with system-preference support + event dispatch
(function () {
  const LS_KEY = "theme"; // 'light' | 'dark' | 'auto'
  const root = document.documentElement;
  const body = document.body;

  function saved() {
    return localStorage.getItem(LS_KEY);
  }
  function save(v) {
    localStorage.setItem(LS_KEY, v);
  }

  function systemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function apply(theme) {
    // data-theme=light|dark, and keep "theme-auto" class for auto mode (optional)
    const isAuto = theme === "auto";
    const isDark = theme === "dark" || (isAuto && systemPrefersDark());
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    body.classList.toggle("theme-auto", isAuto);
    window.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme, resolved: isDark ? "dark" : "light" },
      })
    );
  }

  function initUI(theme) {
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;

    toggle.checked =
      theme === "dark" || (theme === "auto" && systemPrefersDark());

    const slider = toggle.closest(".switch")?.querySelector(".slider");
    if (!slider) return;

    // restart wave cleanly and remove it when the opacity transition ends
    const playWave = (clientX = null) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX ?? rect.left + rect.width / 2;
      const pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      slider.style.setProperty("--x", `${Math.round(pct * 100)}%`);

      // restart reliably
      slider.classList.remove("wave");
      // force reflow to reset animation state
      // eslint-disable-next-line no-unused-expressions
      slider.offsetWidth;
      slider.classList.add("wave");
    };

    // remove .wave exactly when the ripple fade finishes
    const onWaveDone = (e) => {
      if (e.propertyName === "opacity" && e.target === slider) {
        slider.classList.remove("wave");
      }
    };
    slider.addEventListener("transitionend", onWaveDone);

    // remember pointer origin (mouse/touch/pen) for the next change
    let lastX = null;
    const remember = (e) => {
      lastX = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? null;
    };
    ["pointerdown", "mousedown", "touchstart"].forEach((evt) =>
      slider.addEventListener(evt, remember, { passive: true })
    );

    // toggle handler
    toggle.addEventListener("change", () => {
      const resolved = toggle.checked ? "dark" : "light";
      save(resolved);
      apply(resolved);
      playWave(lastX);
      lastX = null;
    });

    // right-click → AUTO
    toggle.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      save("auto");
      apply("auto");
      toggle.checked = systemPrefersDark();
      playWave(lastX);
      lastX = null;
    });

    // react to system changes while in AUTO
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener?.("change", () => {
        if ((saved() || "auto") === "auto") apply("auto");
      });
    }
  }

  // init
  const theme = saved() || "auto";
  apply(theme);
  document.addEventListener("DOMContentLoaded", () => initUI(theme));
})();
