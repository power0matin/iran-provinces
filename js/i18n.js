/* js/i18n.js */
(() => {
  const LS_KEY = "lang";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

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
      "contact.title": "تماس",
      "contact.badge": "پاسخ معمولاً کمتر از ۲۴ ساعت",
      "contact.name": "نام",
      "contact.namePlaceholder": "نام شما",
      "contact.nameHelp": "حداقل ۲ کاراکتر",
      "contact.email": "ایمیل",
      "contact.emailHelp": "برای پاسخ لازم است",
      "contact.subject": "موضوع",
      "contact.subject.general": "عمومی",
      "contact.subject.bug": "گزارش باگ",
      "contact.subject.feature": "پیشنهاد ویژگی",
      "contact.subject.support": "پشتیبانی",
      "contact.attach": "پیوست (اختیاری)",
      "contact.drop": "فایل را بکشید و رها کنید یا کلیک کنید",
      "contact.message": "پیام",
      "contact.messagePlaceholder": "پیام خود را بنویسید…",
      "contact.messageHelp": "حداقل ۱۰ کاراکتر",
      "contact.send": "ارسال",
      "contact.sending": "در حال ارسال...",
      "contact.sent": "پیام با موفقیت ارسال شد.",
      "contact.reset": "پاک‌سازی",
      "contact.quick": "راه‌های سریع",
      "contact.faq": "سوالات متداول",
      "contact.faq.1.q": "چطور باگ گزارش کنم؟",
      "contact.faq.1.a":
        "موضوع «گزارش باگ» را انتخاب کنید و جزییات را بنویسید.",
      "contact.faq.2.q": "چقدر طول می‌کشد پاسخ بدهید؟",
      "contact.faq.2.a": "معمولاً کمتر از ۲۴ ساعت.",
      "contact.privacy": "اطلاعات شما ذخیره یا به اشتراک گذاشته نمی‌شود.",
      "contact.err": "لطفاً فیلدها را به‌درستی تکمیل کنید.",
      "search.placeholder": "… جستجوی استان",
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
      "contact.title": "Contact",
      "contact.badge": "Replies usually within 24h",
      "contact.name": "Name",
      "contact.namePlaceholder": "Your name",
      "contact.nameHelp": "At least 2 characters",
      "contact.email": "Email",
      "contact.emailHelp": "Required for reply",
      "contact.subject": "Subject",
      "contact.subject.general": "General",
      "contact.subject.bug": "Bug report",
      "contact.subject.feature": "Feature request",
      "contact.subject.support": "Support",
      "contact.attach": "Attachment (optional)",
      "contact.drop": "Drag & drop files or click",
      "contact.message": "Message",
      "contact.messagePlaceholder": "Write your message…",
      "contact.messageHelp": "At least 10 characters",
      "contact.send": "Send",
      "contact.sending": "Sending…",
      "contact.sent": "Message sent successfully.",
      "contact.reset": "Reset",
      "contact.quick": "Quick links",
      "contact.faq": "FAQ",
      "contact.faq.1.q": "How to report a bug?",
      "contact.faq.1.a": "Choose “Bug report” as subject and describe it.",
      "contact.faq.2.q": "How long for a reply?",
      "contact.faq.2.a": "Usually less than 24 hours.",
      "contact.privacy": "We don’t store or share your data.",
      "contact.err": "Please check the form fields.",
      "search.placeholder": "Search provinces…",
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
    if (!val) return null;
    return params && typeof val === "string"
      ? val.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "")
      : val;
  }

  function applyI18n(root = document) {
    // متن ساده
    $$("[data-i18n]", root).forEach((el) => {
      const v = t(el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    // HTML
    $$("[data-i18n-html]", root).forEach((el) => {
      const v = t(el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = v;
    });
    // placeholder / title / aria-label / value
    $$("[data-i18n-placeholder]", root).forEach((el) => {
      const v = t(el.getAttribute("data-i18n-placeholder"));
      if (v != null) el.setAttribute("placeholder", v);
    });
    $$("[data-i18n-title]", root).forEach((el) => {
      const v = t(el.getAttribute("data-i18n-title"));
      if (v != null) el.setAttribute("title", v);
    });
    $$("[data-i18n-aria-label]", root).forEach((el) => {
      const v = t(el.getAttribute("data-i18n-aria-label"));
      if (v != null) el.setAttribute("aria-label", v);
    });
    $$("[data-i18n-value]", root).forEach((el) => {
      const v = t(el.getAttribute("data-i18n-value"));
      if (v != null) el.setAttribute("value", v);
    });
  }

  function emit() {
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
    window.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang } }));
  }
  function set(l) {
    if (!l || l === lang) return;
    lang = l;
    localStorage.setItem(LS_KEY, lang);
    setDirByLang(lang);
    applyI18n(document);
    emit();
  }
  const toggle = () => set(lang === "fa" ? "en" : "fa");
  const get = () => lang;
  const current = get;

  window.I18N = {
    t,
    applyI18n,
    set,
    toggle,
    get,
    current,
    get lang() {
      return lang;
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    setDirByLang(lang);
    applyI18n(document);
    $("#langToggle")?.addEventListener("click", toggle);
  });
})();
