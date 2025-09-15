/* js/darkMode.js */
(() => {
  const LS_KEY = "theme"; // 'light' | 'dark' | 'auto'
  const $ = (s) => document.querySelector(s);

  // auto = بر اساس media-query؛ در UI ما فقط دوحالته است (روشن/تاریک)
  function applyTheme(next) {
    const root = document.documentElement;
    if (next === "dark") {
      root.setAttribute("data-theme", "light"); // برعکس؟ خیر؛ از متغیرهای شما استفاده می‌کنیم:
      // در CSS شما theme با data-theme="light" override شده؛ پس:
      root.removeAttribute("data-theme"); // پاک کنیم و کلاس theme-auto نگذاریم
      document.body.classList.remove("theme-auto");
      root.setAttribute("data-theme", "dark");
    } else if (next === "light") {
      root.setAttribute("data-theme", "light");
      document.body.classList.remove("theme-auto");
    } else {
      // auto
      document.body.classList.add("theme-auto");
      root.removeAttribute("data-theme");
    }
  }

  function readInitial() {
    const v = localStorage.getItem(LS_KEY);
    return v || "auto";
  }

  function setTheme(v) {
    localStorage.setItem(LS_KEY, v);
    applyTheme(v);
    // موج نور کوتاه روی سوییچ
    const label = document.querySelector(".switch.capsule-switch");
    if (label) {
      label.classList.add("input-wave");
      setTimeout(() => label.classList.remove("input-wave"), 300);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = $("#darkModeToggle");
    const prefersDark = matchMedia("(prefers-color-scheme: dark)");
    let current = readInitial();

    // نخستین اعمال
    applyTheme(current);
    if (toggle) {
      toggle.checked =
        current === "dark" || (current === "auto" && prefersDark.matches);
      // موقع کلیک: روشن<->تاریک (auto را فعلا استفاده نمی‌کنیم؛ ساده و پایدار)
      toggle.addEventListener("change", () => {
        setTheme(toggle.checked ? "dark" : "light");
      });
    }

    // اگر کاربر سیستم را عوض کرد و ما در auto باشیم
    prefersDark.addEventListener?.("change", () => {
      const mode = localStorage.getItem(LS_KEY) || "auto";
      if (mode === "auto") applyTheme("auto");
    });
  });
})();
