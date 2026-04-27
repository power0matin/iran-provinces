/* ==========================================================================
   js/province.js
   Province detail page renderer.
   Works with:
   - data/provinces/index.json as { "provinces": [...] }
   - data/provinces/index.json as [...]
   - object map shape: { "tehran": {...}, ... }
   ========================================================================== */

(() => {
  "use strict";

  const INDEX_URL = "data/provinces/index.json";

  const SELECTORS = {
    year: "#year",

    tabs: ".tab",
    panels: ".tab-panel",

    chipCapital: "#chipCapital",
    chipPopulation: "#chipPopulation",
    chipArea: "#chipArea",

    introTitle: "#introTitle",
    introText: "#introText",
    heroImage: "#heroImage",

    countiesAccordion: "#countiesAccordion",
    citiesList: "#citiesList",
    attractionsList: "#attractionsList",
    resultCount: "#resultCount",
  };

  const FALLBACK_TEXT = {
    fa: {
      aboutTitle: "درباره استان",
      noData: "داده‌ای برای این استان یافت نشد.",
      loading: "در حال بارگذاری…",
      capital: "مرکز",
      population: "جمعیت",
      area: "مساحت",
      cities: "شهرها",
      districts: "بخش‌ها",
      empty: "موردی برای نمایش وجود ندارد.",
    },
    en: {
      aboutTitle: "About the Province",
      noData: "No data was found for this province.",
      loading: "Loading…",
      capital: "Capital",
      population: "Population",
      area: "Area",
      cities: "Cities",
      districts: "Districts",
      empty: "Nothing to display.",
    },
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  let currentProvince = null;
  let allProvinces = [];

  function lang() {
    const i18nLang = window.I18N?.get?.();
    const htmlLang = document.documentElement.lang;
    const value = String(i18nLang || htmlLang || "fa").toLowerCase();

    return value.startsWith("en") ? "en" : "fa";
  }

  function isRTL() {
    return lang() === "fa";
  }

  function applyDocumentDirection() {
    document.documentElement.lang = lang();
    document.documentElement.dir = isRTL() ? "rtl" : "ltr";
  }

  function t(key, params = {}) {
    const fromI18n = window.I18N?.t?.(key, params);
    if (fromI18n && fromI18n !== key) return fromI18n;

    const localKey = key.split(".").pop();
    let value = FALLBACK_TEXT[lang()]?.[localKey] || key;

    Object.entries(params).forEach(([k, v]) => {
      value = value.replaceAll(`{${k}}`, String(v));
    });

    return value;
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return map[char];
    });
  }

  function normalizeText(value = "") {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/\u200c/g, " ")
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[أإآ]/g, "ا")
      .replace(/ۀ/g, "ه")
      .replace(/[ًٌٍَُِّْ]/g, "")
      .replace(/ـ/g, "")
      .replace(/&/g, " and ")
      .replace(/[-_]+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function slugify(value = "") {
    return normalizeText(value)
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function numberFormat(value, fallback = "—") {
    const number = Number(value);

    if (!Number.isFinite(number)) return fallback;

    try {
      return number.toLocaleString(lang() === "fa" ? "fa-IR" : "en-US");
    } catch {
      return String(number);
    }
  }

  function arrayValue(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function provinceName(province, targetLang = lang()) {
    if (!province) return "";

    const names =
      province.names && typeof province.names === "object"
        ? province.names
        : {};

    if (targetLang === "en") {
      return (
        names.en ||
        province.nameEn ||
        province.name_en ||
        province.en ||
        names.fa ||
        province.nameFa ||
        province.name ||
        province.id ||
        province.slug ||
        ""
      );
    }

    return (
      names.fa ||
      province.nameFa ||
      province.name_fa ||
      province.fa ||
      province.name ||
      names.en ||
      province.nameEn ||
      province.id ||
      province.slug ||
      ""
    );
  }

  function localizedValue(value, fallback = "") {
    if (value == null) return fallback;

    if (typeof value === "object" && !Array.isArray(value)) {
      return value[lang()] || value.fa || value.en || fallback;
    }

    return String(value);
  }

  function normalizeProvince(raw, idFromObject = "") {
    if (!raw || typeof raw !== "object") return null;

    const slug = String(raw.slug || raw.id || idFromObject || "").trim();
    const names = raw.names && typeof raw.names === "object" ? raw.names : {};

    const nameFa = String(
      names.fa || raw.nameFa || raw.name_fa || raw.fa || raw.name || "",
    ).trim();
    const nameEn = String(
      names.en || raw.nameEn || raw.name_en || raw.en || raw.name || "",
    ).trim();

    if (!slug && !nameFa && !nameEn) return null;

    return {
      ...raw,
      id: raw.id || slug || slugify(nameEn || nameFa),
      slug: slug || slugify(nameEn || nameFa),
      names: {
        fa: nameFa || nameEn || slug,
        en: nameEn || nameFa || slug,
      },
    };
  }

  function normalizeIndex(data) {
    let list = [];

    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data?.provinces)) {
      list = data.provinces;
    } else if (data && typeof data === "object") {
      list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
    }

    const seen = new Set();

    return list
      .map((item) => normalizeProvince(item, item?.id))
      .filter(Boolean)
      .filter((province) => {
        const key = province.slug || province.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function getRequestedId() {
    const params = new URLSearchParams(window.location.search);
    return slugify(params.get("id") || params.get("province") || "");
  }

  function findProvince(id) {
    if (!id) return null;

    return (
      allProvinces.find((province) => slugify(province.slug) === id) ||
      allProvinces.find((province) => slugify(province.id) === id) ||
      allProvinces.find(
        (province) => slugify(provinceName(province, "fa")) === id,
      ) ||
      allProvinces.find(
        (province) => slugify(provinceName(province, "en")) === id,
      ) ||
      null
    );
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value ?? "";
  }

  function setHTML(selector, html) {
    const element = $(selector);
    if (element) element.innerHTML = html ?? "";
  }

  function setYear() {
    const element = $(SELECTORS.year);
    if (element) element.textContent = new Date().getFullYear();
  }

  function setupTabs() {
    const tabs = $$(SELECTORS.tabs);
    const panels = $$(SELECTORS.panels);

    if (!tabs.length) return;

    tabs.forEach((tab, index) => {
      const name = tab.dataset.tab;
      const panel = name ? $(`#panel-${CSS.escape(name)}`) : panels[index];

      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");

      if (panel) {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-hidden", "true");

        if (!panel.id && name) {
          panel.id = `panel-${name}`;
        }

        if (!tab.id && name) {
          tab.id = `tab-${name}`;
        }

        if (tab.id) panel.setAttribute("aria-labelledby", tab.id);
        if (panel.id) tab.setAttribute("aria-controls", panel.id);
      }
    });

    const activate = (targetTab, shouldFocus = false) => {
      if (!targetTab) return;

      const targetName = targetTab.dataset.tab;

      tabs.forEach((tab) => {
        tab.classList.remove("active", "is-active");
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
      });

      panels.forEach((panel) => {
        panel.classList.remove("active");
        panel.setAttribute("aria-hidden", "true");
      });

      targetTab.classList.add("is-active");
      targetTab.setAttribute("aria-selected", "true");
      targetTab.setAttribute("tabindex", "0");

      const targetPanel = targetName
        ? $(`#panel-${CSS.escape(targetName)}`)
        : null;
      if (targetPanel) {
        targetPanel.classList.add("active");
        targetPanel.setAttribute("aria-hidden", "false");
      }

      if (shouldFocus) targetTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));

      tab.addEventListener("keydown", (event) => {
        const rtl = document.documentElement.dir === "rtl";
        let nextIndex = null;

        switch (event.key) {
          case "ArrowRight":
            nextIndex = rtl ? index - 1 : index + 1;
            break;
          case "ArrowLeft":
            nextIndex = rtl ? index + 1 : index - 1;
            break;
          case "Home":
            nextIndex = 0;
            break;
          case "End":
            nextIndex = tabs.length - 1;
            break;
          default:
            return;
        }

        event.preventDefault();

        const normalizedIndex = (nextIndex + tabs.length) % tabs.length;
        activate(tabs[normalizedIndex], true);
      });
    });

    activate($(".tab.is-active") || $(".tab.active") || tabs[0]);
  }

  function renderChips(province) {
    const capital =
      localizedValue(province.capital) ||
      localizedValue(province.center) ||
      localizedValue(province.capitalCity) ||
      "—";

    const population = numberFormat(province.population);
    const area = numberFormat(province.areaKm2 ?? province.area);

    setText(SELECTORS.chipCapital, `${t("chip.capital")}: ${capital}`);
    setText(SELECTORS.chipPopulation, `${t("chip.population")}: ${population}`);
    setText(SELECTORS.chipArea, `${t("chip.area")}: ${area} km²`);
  }

  function renderIntro(province) {
    setText(SELECTORS.introTitle, t("province.aboutTitle"));

    const intro =
      localizedValue(province.intro) ||
      localizedValue(province.about) ||
      localizedValue(province.description) ||
      "";

    setText(SELECTORS.introText, intro);

    const image = $(SELECTORS.heroImage);
    if (!image) return;

    const src =
      localizedValue(province.hero) ||
      localizedValue(province.image) ||
      (Array.isArray(province.images) ? province.images[0] : "");

    const name = provinceName(province);

    if (src) {
      image.src = src;
      image.alt = name;
      image.loading = "lazy";
      image.decoding = "async";
      image.hidden = false;
    } else {
      image.removeAttribute("src");
      image.alt = "";
      image.hidden = true;
    }
  }

  function renderCounties(province) {
    const wrapper = $(SELECTORS.countiesAccordion);
    if (!wrapper) return;

    const counties = arrayValue(province.counties);

    wrapper.innerHTML = "";
    wrapper.setAttribute("role", "list");

    if (!counties.length) {
      wrapper.innerHTML = renderEmptyBlock();
      return;
    }

    const fragment = document.createDocumentFragment();

    counties.forEach((county, index) => {
      const name =
        localizedValue(county.name) || county.nameFa || county.nameEn || "—";
      const cities = arrayValue(county.cities)
        .map(localizedValue)
        .filter(Boolean);
      const districts = arrayValue(county.districts)
        .map(localizedValue)
        .filter(Boolean);

      const item = document.createElement("div");
      const buttonId = `county-btn-${index}`;
      const panelId = `county-panel-${index}`;

      item.className = "acc-item";
      item.setAttribute("role", "listitem");

      item.innerHTML = `
        <button class="acc-head" id="${buttonId}" type="button" aria-expanded="false" aria-controls="${panelId}">
          <strong>${escapeHTML(name)}</strong>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="acc-body" id="${panelId}" role="region" aria-labelledby="${buttonId}" hidden>
          ${
            cities.length
              ? `<div class="muted"><strong>${escapeHTML(t("province.cities"))}:</strong> ${escapeHTML(cities.join(isRTL() ? "، " : ", "))}</div>`
              : ""
          }
          ${
            districts.length
              ? `<div class="muted"><strong>${escapeHTML(t("province.districts"))}:</strong> ${escapeHTML(districts.join(isRTL() ? "، " : ", "))}</div>`
              : ""
          }
        </div>
      `;

      const button = $(".acc-head", item);
      const panel = $(".acc-body", item);

      button.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(isOpen));
        panel.hidden = !isOpen;
      });

      fragment.appendChild(item);
    });

    wrapper.appendChild(fragment);
  }

  function renderEmptyBlock() {
    return `
      <div class="province-empty" role="status">
        ${escapeHTML(t("province.empty"))}
      </div>
    `;
  }

  function renderTiles(items, element) {
    if (!element) return;

    const values = arrayValue(items).map(localizedValue).filter(Boolean);

    element.classList.add("tiles");
    element.setAttribute("role", "list");
    element.innerHTML = "";

    if (!values.length) {
      element.innerHTML = renderEmptyBlock();
      return;
    }

    const fragment = document.createDocumentFragment();

    values.forEach((name) => {
      const li = document.createElement("li");
      li.setAttribute("role", "listitem");

      const span = document.createElement("span");
      span.className = "tile-text";
      span.textContent = name;

      li.appendChild(span);
      fragment.appendChild(li);
    });

    element.appendChild(fragment);
  }

  function renderResultCount(province) {
    const total =
      arrayValue(province.counties).length +
      arrayValue(province.cities).length +
      arrayValue(province.attractions).length;

    setText(SELECTORS.resultCount, total ? numberFormat(total) : "");
  }

  function renderNotFound() {
    document.title = t("province.noData");

    setText(SELECTORS.introTitle, t("province.aboutTitle"));
    setText(SELECTORS.introText, t("msg.noData"));

    setHTML(SELECTORS.countiesAccordion, "");
    setHTML(SELECTORS.citiesList, "");
    setHTML(SELECTORS.attractionsList, "");
    setText(SELECTORS.resultCount, "");

    const image = $(SELECTORS.heroImage);
    if (image) {
      image.hidden = true;
      image.removeAttribute("src");
      image.alt = "";
    }
  }

  function renderProvince(province) {
    if (!province) {
      renderNotFound();
      return;
    }

    currentProvince = province;
    applyDocumentDirection();

    const name = provinceName(province);
    document.title = name;

    renderChips(province);
    renderIntro(province);
    renderCounties(province);
    renderTiles(province.cities, $(SELECTORS.citiesList));
    renderTiles(province.attractions, $(SELECTORS.attractionsList));
    renderResultCount(province);

    window.dispatchEvent(
      new CustomEvent("provincerender", {
        detail: {
          province,
          lang: lang(),
        },
      }),
    );
  }

  async function loadIndex() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(INDEX_URL, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Index request failed: ${response.status}`);
      }

      return normalizeIndex(await response.json());
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function main() {
    setupTabs();
    setYear();
    applyDocumentDirection();

    setText(SELECTORS.introTitle, t("province.loading"));

    try {
      allProvinces = await loadIndex();
    } catch (error) {
      console.error("[province.js] Failed to load province index:", error);
      renderNotFound();
      return;
    }

    const requestedId = getRequestedId();
    const province = findProvince(requestedId);

    renderProvince(province);

    window.addEventListener("langchange", () => {
      applyDocumentDirection();
      renderProvince(currentProvince);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
  } else {
    main();
  }
})();
