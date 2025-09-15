// js/app.js
(function () {
  const $ = (s) => document.querySelector(s);
  const listEl = $("#provinceList");
  const badgeEl = $("#countBadge");
  const search = $("#searchInput");

  $("#year") && ($("#year").textContent = new Date().getFullYear());
  $("#navToggle")?.addEventListener("click", () =>
    $("#mainNav")?.classList.toggle("open")
  );
  window.addEventListener("load", () => {
    if (typeof imageMapResize === "function") imageMapResize();
  });

  // فالبک داخلی ۳۱ استان
  const FALLBACK = [
    { id: "alborz", nameFa: "البرز", nameEn: "Alborz", capital: "کرج" },
    { id: "ardabil", nameFa: "اردبیل", nameEn: "Ardabil", capital: "اردبیل" },
    {
      id: "azarbaijan-east",
      nameFa: "آذربایجان شرقی",
      nameEn: "East Azerbaijan",
      capital: "تبریز",
    },
    {
      id: "azarbaijan-west",
      nameFa: "آذربایجان غربی",
      nameEn: "West Azerbaijan",
      capital: "ارومیه",
    },
    { id: "bushehr", nameFa: "بوشهر", nameEn: "Bushehr", capital: "بوشهر" },
    {
      id: "chaharmahal-bakhtiari",
      nameFa: "چهارمحال و بختیاری",
      nameEn: "Chaharmahal and Bakhtiari",
      capital: "شهرکرد",
    },
    { id: "fars", nameFa: "فارس", nameEn: "Fars", capital: "شیراز" },
    { id: "gilan", nameFa: "گیلان", nameEn: "Gilan", capital: "رشت" },
    { id: "golestan", nameFa: "گلستان", nameEn: "Golestan", capital: "گرگان" },
    { id: "hamadan", nameFa: "همدان", nameEn: "Hamadan", capital: "همدان" },
    {
      id: "hormozgan",
      nameFa: "هرمزگان",
      nameEn: "Hormozgan",
      capital: "بندرعباس",
    },
    { id: "ilam", nameFa: "ایلام", nameEn: "Ilam", capital: "ایلام" },
    { id: "isfahan", nameFa: "اصفهان", nameEn: "Isfahan", capital: "اصفهان" },
    { id: "kerman", nameFa: "کرمان", nameEn: "Kerman", capital: "کرمان" },
    {
      id: "kermanshah",
      nameFa: "کرمانشاه",
      nameEn: "Kermanshah",
      capital: "کرمانشاه",
    },
    {
      id: "khuzestan",
      nameFa: "خوزستان",
      nameEn: "Khuzestan",
      capital: "اهواز",
    },
    {
      id: "kohgiluyeh-boyerahmad",
      nameFa: "کهگیلویه و بویراحمد",
      nameEn: "Kohgiluyeh and Boyer-Ahmad",
      capital: "یاسوج",
    },
    {
      id: "kordestan",
      nameFa: "کردستان",
      nameEn: "Kurdistan",
      capital: "سنندج",
    },
    {
      id: "khorasan-north",
      nameFa: "خراسان شمالی",
      nameEn: "North Khorasan",
      capital: "بجنورد",
    },
    {
      id: "khorasan-razavi",
      nameFa: "خراسان رضوی",
      nameEn: "Razavi Khorasan",
      capital: "مشهد",
    },
    {
      id: "khorasan-south",
      nameFa: "خراسان جنوبی",
      nameEn: "South Khorasan",
      capital: "بیرجند",
    },
    {
      id: "lorestan",
      nameFa: "لرستان",
      nameEn: "Lorestan",
      capital: "خرم‌آباد",
    },
    { id: "markazi", nameFa: "مرکزی", nameEn: "Markazi", capital: "اراک" },
    {
      id: "mazandaran",
      nameFa: "مازندران",
      nameEn: "Mazandaran",
      capital: "ساری",
    },
    { id: "qazvin", nameFa: "قزوین", nameEn: "Qazvin", capital: "قزوین" },
    { id: "qom", nameFa: "قم", nameEn: "Qom", capital: "قم" },
    { id: "semnan", nameFa: "سمنان", nameEn: "Semnan", capital: "سمنان" },
    {
      id: "sistan-baluchestan",
      nameFa: "سیستان و بلوچستان",
      nameEn: "Sistan and Baluchestan",
      capital: "زاهدان",
    },
    { id: "tehran", nameFa: "تهران", nameEn: "Tehran", capital: "تهران" },
    { id: "yazd", nameFa: "یزد", nameEn: "Yazd", capital: "یزد" },
    { id: "zanjan", nameFa: "زنجان", nameEn: "Zanjan", capital: "زنجان" },
  ];

  let PROVINCES = [];

  async function loadIndex() {
    try {
      const idx = await fetch("data/provinces/index.json", {
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : Promise.reject()));
      PROVINCES = idx?.provinces?.length ? idx.provinces : FALLBACK;
    } catch {
      PROVINCES = FALLBACK;
    }
    renderList();
  }

  function renderList(q = "") {
    const lang = I18N.current();
    const query = (q || "").trim().toLowerCase();
    const items = PROVINCES.map((p) => ({
      id: p.id,
      fa: p.nameFa || p.name,
      en: p.nameEn || p.nameEn,
      text: lang === "fa" ? p.nameFa : p.nameEn,
    })).filter(
      (x) =>
        !query ||
        x.fa.toLowerCase().includes(query) ||
        x.en.toLowerCase().includes(query)
    );

    listEl.innerHTML = items
      .map(
        (x) => `
      <li><a class="province" href="province.html?id=${x.id}">${x.text}</a></li>
    `
      )
      .join("");

    badgeEl.textContent = String(items.length);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      search?.focus();
    }
    if (e.key === "Escape" && document.activeElement === search) {
      search.value = "";
      search.blur();
      renderList("");
    }
  });
  search?.addEventListener("input", (e) => renderList(e.target.value));

  document
    .getElementById("langToggle")
    ?.addEventListener("click", () => I18N.toggle());
  document.addEventListener("i18n:changed", () =>
    renderList(search?.value || "")
  );

  I18N.apply();
  loadIndex();

  /* Header interactions: mobile drawer + search shortcuts + basic helpers */
  (function () {
    const nav = document.getElementById("mainNav");
    const toggle = document.getElementById("navToggle");
    const backdrop = document.getElementById("navBackdrop");
    const search = document.getElementById("searchInput");

    const openNav = () => {
      nav.classList.add("open");
      backdrop.classList.add("show");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const closeNav = () => {
      nav.classList.remove("open");
      backdrop.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    toggle?.addEventListener("click", () =>
      nav.classList.contains("open") ? closeNav() : openNav()
    );
    backdrop?.addEventListener("click", closeNav);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // close when clicking a nav link on mobile
    nav?.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeNav();
    });

    // quick focus search with "/"
    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          search?.focus();
        }
      }
    });

    // simple client-side search (اختیاری – اگر لیست دارید)
    window.App = window.App || {};
    window.App.filterProvinces = function (q) {
      const ul = document.getElementById("provinceList");
      if (!ul) return;
      q = (q || "").trim();
      for (const li of ul.querySelectorAll("li")) {
        const txt = (li.textContent || "").trim();
        li.style.display = txt.includes(q) ? "" : "none";
      }
      // badge
      const badge = document.getElementById("countBadge");
      if (badge)
        badge.textContent = ul.querySelectorAll(
          'li:not([style*="display: none"])'
        ).length;
    };
    search?.addEventListener("input", (e) =>
      App.filterProvinces(e.target.value)
    );
  })();
})();
