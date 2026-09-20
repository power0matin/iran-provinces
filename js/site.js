// js/site.js
(function () {
  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------- footer year ----------
  document.addEventListener("DOMContentLoaded", () => {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });

  // ---------- MOBILE NAV ----------
  const state = { navOpen: false };
  const nav = $("#mainNav");
  const navBtn = $("#navToggle");
  const backdrop = $("#navBackdrop");

  function setNav(open) {
    state.navOpen = !!open;
    nav?.classList.toggle("open", state.navOpen);
    navBtn?.setAttribute("aria-expanded", String(state.navOpen));
    backdrop?.setAttribute("aria-hidden", String(!state.navOpen));
    backdrop?.classList.toggle("show", state.navOpen);
    document.documentElement.classList.toggle("nav-lock", state.navOpen);
    document.body.classList.toggle("nav-lock", state.navOpen);
  }
  function toggleNav(force) {
    setNav(typeof force === "boolean" ? force : !state.navOpen);
  }
  // expose (optional)
  window.Site = Object.assign(window.Site || {}, { toggleNav });

  // Clicks: delegation (never double-binds)
  document.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target : null;

    // nav open/close
    if (t && t.closest("#navToggle")) {
      toggleNav();
      return;
    }
    if (t && backdrop && t === backdrop) {
      toggleNav(false);
      return;
    }
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
    if (e.key === "Escape" && state.navOpen) {
      toggleNav(false);
    }
  });

  // ---------- optional: image map resizer hook ----------
  document.addEventListener("DOMContentLoaded", () => {
    window.imageMapResize?.();
  });
})();
