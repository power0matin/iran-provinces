// js/nav.js
(function () {
  function $(id) {
    return document.getElementById(id);
  }
  function ready(fn) {
    document.readyState !== "loading"
      ? fn()
      : document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var nav = $("mainNav");
    var toggle = $("navToggle");
    if (!nav || !toggle) return;

    // بک‌دراپ اگر نبود بساز
    var backdrop = $("navBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "navBackdrop";
      backdrop.className = "nav-backdrop";
      nav.parentNode.insertBefore(backdrop, nav.nextSibling);
    }

    var BP = 900; // باید با media-query شما هم‌خوان باشد
    function isMobile() {
      return window.innerWidth < BP;
    }

    function openNav() {
      if (nav.classList.contains("open")) return;
      if (!isMobile()) return; // فقط در موبایل کشویی می‌شود
      nav.classList.add("open");
      backdrop.classList.add("show");
      toggle.setAttribute("aria-expanded", "true");
      nav.setAttribute("aria-hidden", "false");
      // قفل اسکرول بدنه
      document.body.dataset._overflow = document.body.style.overflow || "";
      document.body.style.overflow = "hidden";
      // فوکوس اولین آیتم
      var first = nav.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
      if (first) first.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function closeNav() {
      nav.classList.remove("open");
      backdrop.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = document.body.dataset._overflow || "";
      document.removeEventListener("keydown", onKeydown);
    }

    function onKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeNav();
      }
    }

    toggle.addEventListener("click", function () {
      nav.classList.contains("open") ? closeNav() : openNav();
    });

    backdrop.addEventListener("click", closeNav);

    // کلیک روی هر لینک داخل منو → بستن
    nav.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a) closeNav();
    });

    // وقتی عرض از BP بیشتر شد منو ریست شود
    window.addEventListener("resize", function () {
      if (!isMobile()) closeNav();
    });

    // مقداردهی ARIA اولیه
    toggle.setAttribute("aria-controls", "mainNav");
    toggle.setAttribute("aria-expanded", "false");
    nav.setAttribute("aria-hidden", "true");
  });
})();
