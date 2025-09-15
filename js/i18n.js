/* js/i18n.js */
(() => {
  const LS_KEY = "lang";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // واژه‌نامه‌ها
  const dict = {
    fa: {
      "brand.title": "استان‌های ایران",
      "header.lang": "زبان",
      "nav.home": "خانه",
      "nav.about": "درباره",
      "nav.contact": "تماس",
      "home.provinces": "استان‌ها",
      "home.hint": "کلید / برای فوکوس جستجو و کلید Esc برای پاک‌سازی.",
      "province.intro": "معرفی",
      "province.counties": "شهرستان‌ها",
      "province.cities": "شهرها",
      "province.attractions": "دیدنی‌ها",
      "province.aboutTitle": "درباره استان",
      "footer.rights": "تمامی حقوق محفوظ است.",
      "msg.noData": "داده‌ای برای این استان یافت نشد.",
      "chip.capital": "مرکز: {v}",
      "chip.population": "جمعیت: {v}",
      "chip.area": "مساحت: {v} کیلومتر مربع",
    },
    en: {
      "brand.title": "Provinces of Iran",
      "header.lang": "Language",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.contact": "Contact",
      "home.provinces": "Provinces",
      "home.hint": "Press / to focus search and Esc to clear.",
      "province.intro": "Overview",
      "province.counties": "Counties",
      "province.cities": "Cities",
      "province.attractions": "Attractions",
      "province.aboutTitle": "About the Province",
      "footer.rights": "All rights reserved.",
      "msg.noData": "No data found for this province.",
      "chip.capital": "Capital: {v}",
      "chip.population": "Population: {v}",
      "chip.area": "Area: {v} km²",
    },
  };

  // حالت و ابزار
  let lang =
    localStorage.getItem(LS_KEY) || document.documentElement.lang || "fa";

  function setDirByLang(l) {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
  }

  function t(key, params) {
    const d = dict[lang] || dict.fa;
    const val = d[key];
    if (!val) return null; // اجازه بده متن اصلی صفحه باقی بماند
    if (params && typeof val === "string") {
      return val.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "");
    }
    return val;
  }

  function applyI18n(root = document) {
    $$("[data-i18n]", root).forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const txt = t(key);
      if (txt) el.textContent = txt; // فقط اگر ترجمه داریم جایگزین کن
    });
  }

  function toggleLang() {
    lang = lang === "fa" ? "en" : "fa";
    localStorage.setItem(LS_KEY, lang);
    setDirByLang(lang);
    applyI18n(document);
    // رویداد برای اسکریپت‌های دیگر (مثلا province.js) که متن داینامیک دارند
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  // اکسپورت مینیمال
  window.I18N = {
    t,
    applyI18n,
    get lang() {
      return lang;
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    setDirByLang(lang);
    applyI18n(document);
    $("#langToggle")?.addEventListener("click", toggleLang);
  });
})();
