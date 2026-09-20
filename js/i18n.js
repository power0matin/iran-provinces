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
      "contact.message": "پیام",
      "contact.messagePlaceholder": "پیام خود را بنویسید…",
      "contact.messageHelp": "حداقل ۱۰ کاراکتر",
      "contact.send": "ارسال",
      "contact.reset": "پاک‌سازی",
      "contact.mailOpened": "برنامه ایمیل شما باز شد؛ پیام را از همان‌جا ارسال کنید.",
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
      "a11y.skip": "پرش به محتوا",
      "noscript": "برای تجربه کامل، جاوااسکریپت مرورگر را فعال کنید.",
      "about.version": "نسخه ۱.۴.۰",
      "about.hero.title": "این وب‌سایت برای معرفی جامع استان‌های ایران ساخته شده است.",
      "about.hero.lead": "داده‌ها به‌صورت پویا قابل به‌روزرسانی‌اند و رابط کاربری از <strong>حالت تیره/روشن</strong>، <strong>جستجو</strong> و <strong>چندزبانه</strong> پشتیبانی می‌کند. تمرکز اصلی ما ارائه اطلاعات معتبر، ساختار‌یافته و قابل دسترس برای دانش‌آموزان، پژوهشگران و علاقه‌مندان است.",
      "about.hero.tip": "میانبرها: برای فوکوس روی جستجو کلید <span class=\"kbd\">/</span> و برای پاک‌سازی جستجو <span class=\"kbd\">Esc</span> را بزنید.",
      "about.mission.title": "ماموریت و اهداف",
      "about.mission.mission": "ماموریت",
      "about.mission.text": "فراهم کردن مرجع برخطی که اطلاعات کلیدی هر استان—از موقعیت جغرافیایی و تقسیمات تا جمعیت و جاذبه‌ها—را به شکلی استاندارد، خوش‌خوان و قابل استناد ارائه دهد.",
      "about.mission.goals": "اهداف",
      "about.mission.g1": "ارائه داده‌های دقیق و منبع‌دار",
      "about.mission.g2": "دسترسی سریع با جستجوی هوشمند",
      "about.mission.g3": "پشتیبانی از چند زبان برای مخاطبان گسترده",
      "about.mission.g4": "قابلیت استفاده بالا در موبایل و دسکتاپ",
      "about.features.title": "امکانات کلیدی",
      "about.features.f1": "جستجوی سریع نام استان‌ها و فیلتر نتایج",
      "about.features.f2": "نقشه تعاملی با کلیک روی هر استان (Leaflet)",
      "about.features.f3": "حالت تیره/روشن با ذخیره ترجیح کاربر",
      "about.features.f4": "چندزبانه با کلید تغییر سریع زبان",
      "about.features.f5": "دسترسی‌پذیری: ناوبری با کی‌بورد، برچسب‌های ARIA و کنتراست مناسب",
      "about.features.f6": "ساختار ماژولار فایل‌ها: <span class=\"code\">style.css</span>، <span class=\"code\">components.css</span>، <span class=\"code\">responsive.css</span>",
      "about.data.title": "منابع و به‌روزرسانی داده‌ها",
      "about.data.text": "اطلاعات پایه استان‌ها از منابع عمومی و داده‌های رسمی گردآوری می‌شود. داده‌ها ساختارمند هستند و در نسخه‌های بعدی، امکان همگام‌سازی و به‌روزرسانی خودکار پیش‌بینی شده است. هرگونه اصلاح یا پیشنهاد شما باعث بهبود کیفیت خواهد شد.",
      "about.data.p1": "بازبینی دوره‌ای برای اطمینان از صحت",
      "about.data.p2": "ارجاع به منابع در صورت نیاز داخل صفحات هر استان",
      "about.howto.title": "چگونه استفاده کنیم؟",
      "about.howto.s1": "از کادر جستجو نام استان را وارد کنید (میانبر: <span class=\"kbd\">/</span>).",
      "about.howto.s2": "در صفحه استان، نمای کلی، آمار، تقسیمات و جاذبه‌ها را ببینید.",
      "about.howto.s3": "برای تغییر زبان روی دکمه <em>زبان</em> بزنید.",
      "about.howto.s4": "برای تم دلخواه، سوئیچ خورشید/ماه را تغییر دهید.",
      "about.faq.title": "سوالات متداول",
      "about.faq.q1": "چطور داده‌ها به‌روز می‌شوند؟",
      "about.faq.a1": "داده‌ها به‌صورت دوره‌ای بازبینی می‌شوند و در صورت انتشار نسخه‌های رسمی، به‌روزرسانی می‌گردند.",
      "about.faq.q2": "آیا می‌توانم مشارکت کنم؟",
      "about.faq.a2": "بله، از طریق صفحه تماس می‌توانید پیشنهاد و ایرادات را ارسال کنید.",
      "about.faq.q3": "آیا حالت تیره خودکار است؟",
      "about.faq.a3": "در حالت خودکار (کلیک راست روی سوئیچ تم)، تم بر اساس ترجیح سیستم شما اعمال می‌شود و می‌توانید دستی هم تغییر دهید.",
      "about.roadmap.title": "نقشه‌راه نسخه‌های بعد",
      "about.roadmap.r1": "فیلترهای پیشرفته (جمعیت، مساحت، آب‌وهوا)",
      "about.roadmap.r2": "مقایسه دو استان در یک نگاه",
      "about.roadmap.r3": "گالری تصاویر و لینک به منابع گردشگری",
      "about.credits.title": "اعتبارات و سپاس",
      "about.credits.text": "از تمامی همیاران و بازبین‌ها برای مشارکت در بهبود کیفیت داده‌ها سپاسگزاریم. اگر شما هم علاقه‌مندید در این پروژه سهیم باشید، از صفحه تماس پیام بگذارید.",
      "about.license.title": "مجوز استفاده",
      "about.license.text": "محتوای متنی تا حد امکان با ذکر منبع قابل استفاده است. کد رابط کاربری تحت مجوز MIT ارائه می‌شود مگر آن‌که در مخزن پروژه خلاف آن ذکر شده باشد.",
      "about.cta.title": "پیشنهاد یا ایرادی دارید؟",
      "about.cta.action": "ارسال بازخورد",
      "home.map": "نقشه تعاملی",
      "home.mapHint": "با هاور/تاچ روی هر استان نام آن را ببینید؛ با کلیک وارد صفحه همان استان شوید.",
      "footer.by": "طراحی توسط",
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
      "contact.message": "Message",
      "contact.messagePlaceholder": "Write your message…",
      "contact.messageHelp": "At least 10 characters",
      "contact.send": "Send",
      "contact.reset": "Reset",
      "contact.mailOpened": "Your mail app opened — send the message from there.",
      "contact.quick": "Quick links",
      "contact.faq": "FAQ",
      "contact.faq.1.q": "How to report a bug?",
      "contact.faq.1.a": "Choose “Bug report” as subject and describe it.",
      "contact.faq.2.q": "How long for a reply?",
      "contact.faq.2.a": "Usually less than 24 hours.",
      "contact.privacy": "We don’t store or share your data.",
      "contact.err": "Please check the form fields.",
      "search.placeholder": "Search provinces…",
      "a11y.skip": "Skip to content",
      "noscript": "Enable JavaScript in your browser for the full experience.",
      "about.version": "Version 1.4.0",
      "about.hero.title": "This website was built as a comprehensive guide to the provinces of Iran.",
      "about.hero.lead": "Data can be updated dynamically, and the interface supports <strong>dark/light mode</strong>, <strong>search</strong> and <strong>multiple languages</strong>. Our main focus is reliable, structured and accessible information for students, researchers and enthusiasts.",
      "about.hero.tip": "Shortcuts: press <span class=\"kbd\">/</span> to focus search and <span class=\"kbd\">Esc</span> to clear it.",
      "about.mission.title": "Mission and goals",
      "about.mission.mission": "Mission",
      "about.mission.text": "To provide an online reference that presents each province's key information — from geography and divisions to population and attractions — in a standard, readable and citable form.",
      "about.mission.goals": "Goals",
      "about.mission.g1": "Accurate, well-sourced data",
      "about.mission.g2": "Fast access through smart search",
      "about.mission.g3": "Multilingual support for a wider audience",
      "about.mission.g4": "Great usability on mobile and desktop",
      "about.features.title": "Key features",
      "about.features.f1": "Fast province search with result filtering",
      "about.features.f2": "Interactive map — click any province to open it (Leaflet)",
      "about.features.f3": "Dark/light mode that remembers your preference",
      "about.features.f4": "Multilingual with a quick language switch",
      "about.features.f5": "Accessibility: keyboard navigation, ARIA labels and good contrast",
      "about.features.f6": "Modular file structure: <span class=\"code\">style.css</span>, <span class=\"code\">components.css</span>, <span class=\"code\">responsive.css</span>",
      "about.data.title": "Data sources and updates",
      "about.data.text": "Basic province information is gathered from public sources and official data. The data is structured, and automatic sync and updates are planned for future versions. Any correction or suggestion from you improves its quality.",
      "about.data.p1": "Periodic review to ensure accuracy",
      "about.data.p2": "References to sources inside each province page where needed",
      "about.howto.title": "How to use it",
      "about.howto.s1": "Type a province name in the search box (shortcut: <span class=\"kbd\">/</span>).",
      "about.howto.s2": "On a province page, see the overview, statistics, divisions and attractions.",
      "about.howto.s3": "To change the language, press the <em>Language</em> button.",
      "about.howto.s4": "To pick a theme, use the sun/moon switch.",
      "about.faq.title": "Frequently asked questions",
      "about.faq.q1": "How is the data updated?",
      "about.faq.a1": "The data is reviewed periodically and updated whenever official releases are published.",
      "about.faq.q2": "Can I contribute?",
      "about.faq.a2": "Yes — send suggestions and corrections through the Contact page.",
      "about.faq.q3": "Is dark mode automatic?",
      "about.faq.a3": "In auto mode (right-click the theme switch) the theme follows your system preference, and you can still change it manually.",
      "about.roadmap.title": "Roadmap",
      "about.roadmap.r1": "Advanced filters (population, area, climate)",
      "about.roadmap.r2": "Compare two provinces at a glance",
      "about.roadmap.r3": "Image gallery and links to tourism resources",
      "about.credits.title": "Credits and thanks",
      "about.credits.text": "We thank all contributors and reviewers for helping improve the quality of the data. If you'd like to contribute too, leave a message on the Contact page.",
      "about.license.title": "License",
      "about.license.text": "Text content may be reused with attribution wherever possible. The UI code is released under the MIT license unless stated otherwise in the project repository.",
      "about.cta.title": "Have a suggestion or found an issue?",
      "about.cta.action": "Send feedback",
      "home.map": "Interactive map",
      "home.mapHint": "Hover or tap a province to see its name; click to open its page.",
      "footer.by": "Designed by",
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
