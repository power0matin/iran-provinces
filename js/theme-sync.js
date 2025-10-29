// js/theme-sync.js
(() => {
  /**
   * Theme Sync (power0matin.github.io)
   * پشتیبانی از هر دو ساختار: class="dark" و data-theme="dark"
   */

  const root = document.documentElement;

  // 1️⃣ تشخیص تم اولیه
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = saved || (prefersDark ? "dark" : "light");

  applyTheme(current);

  // 2️⃣ تابع اعمال تم
  function applyTheme(mode) {
    if (mode === "dark") {
      root.classList.add("dark");
      root.dataset.theme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.dataset.theme = "light";
      localStorage.setItem("theme", "light");
    }

    updateControls(mode === "dark");
  }

  // 3️⃣ شنود بین تب‌ها / سایت‌ها (برای sync کامل)
  window.addEventListener("storage", (e) => {
    if (e.key === "theme" && e.newValue) {
      applyTheme(e.newValue);
    }
  });

  // 4️⃣ تابع آپدیت کنترل‌ها (سوئیچ‌ها یا دکمه‌ها)
  function updateControls(isDark) {
    const chk = document.getElementById("darkModeToggle");
    const btn = document.getElementById("themeButton");
    if (chk) chk.checked = isDark;
    if (btn) btn.setAttribute("aria-pressed", String(isDark));
  }

  // 5️⃣ اتصال به کنترل‌ها
  document.addEventListener("DOMContentLoaded", () => {
    const chk = document.getElementById("darkModeToggle");
    const btn = document.getElementById("themeButton");

    if (chk) {
      chk.checked =
        root.dataset.theme === "dark" || root.classList.contains("dark");
      chk.addEventListener("change", () =>
        applyTheme(chk.checked ? "dark" : "light")
      );
    }

    if (btn) {
      btn.setAttribute("aria-pressed", String(current === "dark"));
      btn.addEventListener("click", () => {
        applyTheme(root.classList.contains("dark") ? "light" : "dark");
      });
    }
  });
})();
