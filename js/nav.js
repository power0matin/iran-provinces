// js/nav.js — Drawer موبایل دو سویه (RTL/LTR) + a11y
(() => {
  const BP = 900; // با media query یکی است
  const d = document;
  const nav = d.getElementById("mainNav");
  const toggle = d.getElementById("navToggle");
  if (!nav || !toggle) return;

  // Backdrop را اگر نبود می‌سازیم
  let backdrop = d.getElementById("navBackdrop");
  if (!backdrop) {
    backdrop = d.createElement("div");
    backdrop.id = "navBackdrop";
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop); // یا document.body.appendChild(backdrop)
  }

  const isMobile = () => window.innerWidth < BP;

  const onKeydown = (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) close();
  };

  const open = () => {
    if (!isMobile() || nav.classList.contains("open")) return;
    nav.classList.add("open");
    nav.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");

    backdrop.classList.add("show");
    backdrop.setAttribute("aria-hidden", "false");

    d.body.classList.add("nav-locked"); // قفل اسکرول

    // فوکوس اولین عنصر منو
    const first = nav.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
    if (first) first.focus({ preventScroll: true });

    d.addEventListener("keydown", onKeydown);
  };

  const close = () => {
    if (!nav.classList.contains("open")) return;
    nav.classList.remove("open");
    nav.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");

    backdrop.classList.remove("show");
    backdrop.setAttribute("aria-hidden", "true");

    d.body.classList.remove("nav-locked");
    d.removeEventListener("keydown", onKeydown);
    toggle.focus({ preventScroll: true });
  };

  const toggleNav = () => (nav.classList.contains("open") ? close() : open());

  // رویدادها
  toggle.addEventListener("click", toggleNav);
  backdrop.addEventListener("click", close);
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) close(); // کلیک روی لینک‌ها → بستن
  });

  // خروج از حالت موبایل → بستن
  let rtid;
  window.addEventListener("resize", () => {
    clearTimeout(rtid);
    rtid = setTimeout(() => {
      if (!isMobile()) close();
    }, 80);
  });

  // ARIA اولیه
  toggle.setAttribute("aria-controls", "mainNav");
  toggle.setAttribute("aria-expanded", "false");
  nav.setAttribute("aria-hidden", "true");
})();
