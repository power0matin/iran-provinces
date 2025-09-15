/* js/province.js – works with data/provinces/index.json that has { "provinces": [ ... ] } */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const INDEX_URL = "data/provinces/index.json";

  // --- utils ---
  const slugify = (s) =>
    (s || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[آإأ]/g, "ا")
      .replace(/[ي]/g, "ی")
      .replace(/[ۀ]/g, "ه")
      .replace(/[^a-z0-9\u0600-\u06FF]+/gi, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");

  const num = (v) => {
    try {
      return (+v).toLocaleString(document.documentElement.lang || "fa");
    } catch {
      return v;
    }
  };

  const t = (k, params) => window.I18N?.t(k, params) ?? null;

  // --- rendering ---
  function renderTabs() {
    const tabs = $$(".tab");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const name = btn.dataset.tab;
        $$(".tab-panel").forEach((p) =>
          p.classList.toggle("active", p.id === `panel-${name}`)
        );
      });
    });
  }

  function setYear() {
    const y = new Date().getFullYear();
    const el = $("#year");
    if (el) el.textContent = y;
  }

  function getDisplayName(p) {
    const lang = document.documentElement.lang || "fa";
    if (lang === "en") return p.nameEn || p.nameFa || p.name || p.id;
    return p.nameFa || p.name || p.nameEn || p.id;
  }

  function renderChips(p) {
    $("#chipCapital").textContent =
      t("chip.capital", { v: p.capital ?? "—" }) || `مرکز: ${p.capital ?? "—"}`;
    $("#chipPopulation").textContent =
      t("chip.population", { v: num(p.population) }) ||
      `جمعیت: ${num(p.population)}`;
    $("#chipArea").textContent =
      t("chip.area", { v: num(p.areaKm2 ?? p.area) }) ||
      `مساحت: ${num(p.areaKm2 ?? p.area)} km²`;
  }

  function renderIntro(p) {
    $("#introTitle").textContent = t("province.aboutTitle") || "درباره استان";
    $("#introText").textContent = p.intro || p.about || p.description || "";
    const img = $("#heroImage");
    const src = p.hero || (Array.isArray(p.images) ? p.images[0] : "");
    if (src) {
      img.src = src;
      img.alt = getDisplayName(p);
      img.hidden = false;
    } else {
      img.src = "";
      img.alt = "";
      img.hidden = true;
    }
  }

  function renderCounties(p) {
    const wrap = $("#countiesAccordion");
    wrap.innerHTML = "";
    const list = Array.isArray(p.counties) ? p.counties : [];
    list.forEach((c) => {
      const item = document.createElement("div");
      item.className = "acc-item";
      item.innerHTML = `
        <div class="acc-head">
          <strong>${c.name ?? "—"}</strong>
          <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="acc-body">
          ${
            Array.isArray(c.cities) && c.cities.length
              ? `<div class="muted">شهرها: ${c.cities.join("، ")}</div>`
              : ""
          }
          ${
            Array.isArray(c.districts) && c.districts.length
              ? `<div class="muted">بخش‌ها: ${c.districts.join("، ")}</div>`
              : ""
          }
        </div>`;
      item
        .querySelector(".acc-head")
        .addEventListener("click", () => item.classList.toggle("open"));
      wrap.appendChild(item);
    });
  }

  function renderTiles(list, el) {
    el.innerHTML = "";
    (Array.isArray(list) ? list : []).forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      el.appendChild(li);
    });
  }

  function renderNotFound() {
    $("#introTitle").textContent = t("province.aboutTitle") || "درباره استان";
    $("#introText").textContent =
      t("msg.noData") || "داده‌ای برای این استان یافت نشد.";
    $("#countiesAccordion").innerHTML = "";
    $("#citiesList").innerHTML = "";
    $("#attractionsList").innerHTML = "";
    $("#resultCount").textContent = "";
  }

  async function getIndex() {
    const res = await fetch(INDEX_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    // پشتیبانی از دو شکل: {provinces:[...]} یا آبجکت کلید-مقدار
    if (Array.isArray(data?.provinces)) return data.provinces;
    if (data && typeof data === "object") {
      return Object.entries(data).map(([id, v]) => ({ id, ...v }));
    }
    return [];
  }

  async function main() {
    renderTabs();
    setYear();

    // id از URL
    const params = new URLSearchParams(location.search);
    let id = slugify(params.get("id") || "");

    let all = [];
    try {
      all = await getIndex();
    } catch (e) {
      console.error("index.json load error:", e);
      renderNotFound();
      return;
    }

    if (!all.length) {
      renderNotFound();
      return;
    }

    // پیدا کردن استان بر اساس id (slug)
    let p =
      all.find((x) => slugify(x.id) === id) ||
      all.find((x) => slugify(x.nameFa) === id || slugify(x.nameEn) === id);

    if (!p) {
      renderNotFound();
      return;
    }

    // عنوان صفحه
    document.title = getDisplayName(p);

    // رندر
    renderChips(p);
    renderIntro(p);
    renderCounties(p);
    renderTiles(p.cities, $("#citiesList"));
    renderTiles(p.attractions, $("#attractionsList"));
    const total =
      (p.counties?.length || 0) +
      (p.cities?.length || 0) +
      (p.attractions?.length || 0);
    $("#resultCount").textContent = total ? num(total) : "";

    // تغییر زبان → فقط متون ثابت/چیپ‌ها دوباره‌سازی شوند
    window.addEventListener("langchange", () => {
      $("#introTitle").textContent = t("province.aboutTitle") || "درباره استان";
      renderChips(p);
      // عنوان سند هم با نام زبان فعلی
      document.title = getDisplayName(p);
    });
  }

  document.addEventListener("DOMContentLoaded", main);
})();
