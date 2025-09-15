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
    // checkbox ON means dark (resolved)
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;
    toggle.checked =
      theme === "dark" || (theme === "auto" && systemPrefersDark());

    // subtle wave animation on change
    const slider = toggle.closest(".switch")?.querySelector(".slider");
    toggle.addEventListener("change", () => {
      // clicking the checkbox toggles resolved state; we preserve 'auto' only via long-press or code.
      const resolved = toggle.checked ? "dark" : "light";
      save(resolved);
      apply(resolved);

      if (slider) {
        slider.classList.add("wave");
        setTimeout(() => slider.classList.remove("wave"), 350);
      }
    });

    // if you want a tri-state (auto/light/dark), you can cycle via contextmenu (right-click)
    toggle.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      save("auto");
      apply("auto");
      toggle.checked = systemPrefersDark(); // reflect resolved
    });

    // React to system changes in auto mode
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener?.("change", () => {
        const th = saved() || "auto";
        if (th === "auto") apply("auto");
      });
    }
  }

  // init
  const theme = saved() || "auto";
  apply(theme);
  document.addEventListener("DOMContentLoaded", () => initUI(theme));
})();
