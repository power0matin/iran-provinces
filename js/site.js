// js/site.js
(function () {
  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- footer year ----------
  document.addEventListener("DOMContentLoaded", () => {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const isTyping =
      e.target instanceof HTMLElement &&
      !!e.target.closest("input, textarea, [contenteditable='true']");
    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      $("#searchInput")?.focus();
    }
  });
})();
