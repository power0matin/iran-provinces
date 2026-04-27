// js/home.js
// Province list renderer: accessible, multilingual, searchable, resilient.

(() => {
  "use strict";

  const SELECTORS = {
    list: "provinceList",
    badge: "countBadge",
    searchPrimary: "searchInput",
    searchSecondary: "searchInput2",
  };

  const ENDPOINT = "data/provinces/index.json";

  const FALLBACK_PROVINCES = [
    { slug: "alborz", names: { fa: "البرز", en: "Alborz" } },
    { slug: "ardabil", names: { fa: "اردبیل", en: "Ardabil" } },
    {
      slug: "azarbaijan-east",
      names: { fa: "آذربایجان شرقی", en: "East Azerbaijan" },
    },
    {
      slug: "azarbaijan-west",
      names: { fa: "آذربایجان غربی", en: "West Azerbaijan" },
    },
    { slug: "bushehr", names: { fa: "بوشهر", en: "Bushehr" } },
    {
      slug: "chaharmahal-bakhtiari",
      names: { fa: "چهارمحال و بختیاری", en: "Chaharmahal and Bakhtiari" },
    },
    { slug: "fars", names: { fa: "فارس", en: "Fars" } },
    { slug: "gilan", names: { fa: "گیلان", en: "Gilan" } },
    { slug: "golestan", names: { fa: "گلستان", en: "Golestan" } },
    { slug: "hamadan", names: { fa: "همدان", en: "Hamedan" } },
    { slug: "hormozgan", names: { fa: "هرمزگان", en: "Hormozgan" } },
    { slug: "ilam", names: { fa: "ایلام", en: "Ilam" } },
    { slug: "isfahan", names: { fa: "اصفهان", en: "Isfahan" } },
    { slug: "kerman", names: { fa: "کرمان", en: "Kerman" } },
    { slug: "kermanshah", names: { fa: "کرمانشاه", en: "Kermanshah" } },
    { slug: "khuzestan", names: { fa: "خوزستان", en: "Khuzestan" } },
    {
      slug: "kohgiluyeh-boyerahmad",
      names: { fa: "کهگیلویه و بویراحمد", en: "Kohgiluyeh and Boyer-Ahmad" },
    },
    { slug: "kordestan", names: { fa: "کردستان", en: "Kurdistan" } },
    {
      slug: "khorasan-north",
      names: { fa: "خراسان شمالی", en: "North Khorasan" },
    },
    {
      slug: "khorasan-razavi",
      names: { fa: "خراسان رضوی", en: "Razavi Khorasan" },
    },
    {
      slug: "khorasan-south",
      names: { fa: "خراسان جنوبی", en: "South Khorasan" },
    },
    { slug: "lorestan", names: { fa: "لرستان", en: "Lorestan" } },
    { slug: "markazi", names: { fa: "مرکزی", en: "Markazi" } },
    { slug: "mazandaran", names: { fa: "مازندران", en: "Mazandaran" } },
    { slug: "qazvin", names: { fa: "قزوین", en: "Qazvin" } },
    { slug: "qom", names: { fa: "قم", en: "Qom" } },
    { slug: "semnan", names: { fa: "سمنان", en: "Semnan" } },
    {
      slug: "sistan-baluchestan",
      names: { fa: "سیستان و بلوچستان", en: "Sistan and Baluchestan" },
    },
    { slug: "tehran", names: { fa: "تهران", en: "Tehran" } },
    { slug: "yazd", names: { fa: "یزد", en: "Yazd" } },
    { slug: "zanjan", names: { fa: "زنجان", en: "Zanjan" } },
  ];

  const state = {
    provinces: [],
    filtered: [],
    loaded: false,
    loading: false,
    lastQuery: "",
  };

  const $ = (id) => document.getElementById(id);

  const listEl = $(SELECTORS.list);
  const badgeEl = $(SELECTORS.badge);
  const searchEl = $(SELECTORS.searchPrimary) || $(SELECTORS.searchSecondary);

  function currentLang() {
    const i18nLang = window.I18N?.get?.();
    const htmlLang = document.documentElement.lang;

    return normalizeLang(i18nLang || htmlLang || "fa");
  }

  function normalizeLang(value) {
    const lang = String(value || "fa").toLowerCase();

    if (lang.startsWith("en")) return "en";
    return "fa";
  }

  function isRTL() {
    return currentLang() === "fa";
  }

  function t(key, fallbackFa, fallbackEn) {
    if (window.I18N?.t) {
      const value = window.I18N.t(key);
      if (value && value !== key) return value;
    }

    return currentLang() === "fa" ? fallbackFa : fallbackEn;
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
      .replace(/\u200c/g, " ") // ZWNJ
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[أإآ]/g, "ا")
      .replace(/ۀ/g, "ه")
      .replace(/[ًٌٍَُِّْ]/g, "")
      .replace(/[ـ]/g, "")
      .replace(/&/g, " and ")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ");
  }

  function normalizeProvince(raw) {
    if (!raw || typeof raw !== "object") return null;

    const slug = String(raw.slug || raw.id || "").trim();
    const names = raw.names && typeof raw.names === "object" ? raw.names : {};

    const fa = String(
      names.fa || raw.fa || raw.nameFa || raw.name_fa || "",
    ).trim();
    const en = String(
      names.en || raw.en || raw.nameEn || raw.name_en || "",
    ).trim();

    if (!slug || (!fa && !en)) return null;

    return {
      ...raw,
      slug,
      names: {
        fa: fa || en || slug,
        en: en || fa || slug,
      },
    };
  }

  function normalizeProvinceList(data) {
    const source = Array.isArray(data) ? data : FALLBACK_PROVINCES;

    const seen = new Set();

    return source
      .map(normalizeProvince)
      .filter(Boolean)
      .filter((province) => {
        if (seen.has(province.slug)) return false;
        seen.add(province.slug);
        return true;
      });
  }

  function provinceName(province, lang = currentLang()) {
    return (
      province?.names?.[lang] ||
      province?.names?.fa ||
      province?.names?.en ||
      province?.slug ||
      ""
    );
  }

  function provinceSearchText(province) {
    return normalizeText(
      [
        province.slug,
        province.names?.fa,
        province.names?.en,
        province.capital?.fa,
        province.capital?.en,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  function getQuery() {
    return searchEl?.value || "";
  }

  function filterProvinces(query = "") {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return [...state.provinces];
    }

    const tokens = normalizedQuery.split(" ").filter(Boolean);

    return state.provinces.filter((province) => {
      const haystack = provinceSearchText(province);
      return tokens.every((token) => haystack.includes(token));
    });
  }

  function setBadge(count, total) {
    if (!badgeEl) return;

    badgeEl.textContent = String(count);
    badgeEl.setAttribute(
      "aria-label",
      currentLang() === "fa"
        ? `${count} استان از ${total} استان`
        : `${count} of ${total} provinces`,
    );
  }

  function renderEmptyState(query = "") {
    const message = query.trim()
      ? t(
          "home.noResults",
          "استانی با این جستجو پیدا نشد.",
          "No provinces matched your search.",
        )
      : t(
          "home.empty",
          "استانی برای نمایش وجود ندارد.",
          "No provinces to display.",
        );

    return `
      <li class="province-empty" role="status">
        <span>${escapeHTML(message)}</span>
      </li>
    `;
  }

  function renderProvinceItem(province, index) {
    const lang = currentLang();
    const name = provinceName(province, lang);
    const otherName = provinceName(province, lang === "fa" ? "en" : "fa");
    const href = `province.html?id=${encodeURIComponent(province.slug)}`;

    return `
      <li data-name="${escapeHTML(province.slug)}" data-index="${index}">
        <a
          class="province"
          href="${href}"
          data-province-slug="${escapeHTML(province.slug)}"
          aria-label="${escapeHTML(name)}"
          title="${escapeHTML(otherName && otherName !== name ? `${name} / ${otherName}` : name)}"
        >
          <span class="province-name">${escapeHTML(name)}</span>
        </a>
      </li>
    `;
  }

  function render(query = getQuery()) {
    if (!listEl) return;

    const safeQuery = String(query || "");
    const items = filterProvinces(safeQuery);

    state.filtered = items;
    state.lastQuery = safeQuery;

    listEl.dir = isRTL() ? "rtl" : "ltr";
    listEl.lang = currentLang();
    listEl.setAttribute("aria-busy", "false");
    listEl.setAttribute("aria-live", "polite");

    listEl.innerHTML = items.length
      ? items.map(renderProvinceItem).join("")
      : renderEmptyState(safeQuery);

    setBadge(items.length, state.provinces.length);

    window.dispatchEvent(
      new CustomEvent("provincesrender", {
        detail: {
          query: safeQuery,
          count: items.length,
          total: state.provinces.length,
          items,
        },
      }),
    );
  }

  function renderLoading() {
    if (!listEl) return;

    listEl.setAttribute("aria-busy", "true");
    listEl.innerHTML = `
      <li class="province-empty province-loading" role="status">
        <span>${escapeHTML(t("home.loading", "در حال بارگذاری استان‌ها…", "Loading provinces…"))}</span>
      </li>
    `;

    if (badgeEl) badgeEl.textContent = "…";
  }

  async function fetchProvinces() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(ENDPOINT, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load provinces: ${response.status}`);
      }

      return await response.json();
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function load() {
    if (state.loading || state.loaded) return;

    state.loading = true;
    renderLoading();

    try {
      const data = await fetchProvinces();
      state.provinces = normalizeProvinceList(data);
    } catch (error) {
      console.warn("[home.js] Using fallback provinces:", error);
      state.provinces = normalizeProvinceList(FALLBACK_PROVINCES);
    } finally {
      state.loading = false;
      state.loaded = true;
      render(getQuery());
    }
  }

  function debounce(fn, delay = 80) {
    let timer = 0;

    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  }

  function syncSearchClearButton() {
    const clearBtn = document.getElementById("searchClear");
    if (!clearBtn || !searchEl) return;

    const hasValue = Boolean(searchEl.value.trim());
    clearBtn.hidden = !hasValue;
    clearBtn.toggleAttribute("aria-hidden", !hasValue);
  }

  function bindEvents() {
    const debouncedRender = debounce(() => {
      syncSearchClearButton();
      render(getQuery());
    }, 60);

    searchEl?.addEventListener("input", debouncedRender);

    searchEl?.addEventListener("search", () => {
      syncSearchClearButton();
      render(getQuery());
    });

    window.addEventListener("langchange", () => {
      document.documentElement.dir = isRTL() ? "rtl" : "ltr";
      render(getQuery());
    });

    document.addEventListener("keydown", (event) => {
      const key = event.key;

      if (key === "/" && searchEl && document.activeElement !== searchEl) {
        const tagName = document.activeElement?.tagName?.toLowerCase();
        const isTyping =
          tagName === "input" ||
          tagName === "textarea" ||
          document.activeElement?.isContentEditable;

        if (!isTyping) {
          event.preventDefault();
          searchEl.focus();
        }
      }

      if (key === "Escape" && searchEl && document.activeElement === searchEl) {
        searchEl.value = "";
        syncSearchClearButton();
        render("");
      }
    });

    document.getElementById("searchClear")?.addEventListener("click", () => {
      if (!searchEl) return;

      searchEl.value = "";
      searchEl.focus();
      syncSearchClearButton();
      render("");
    });
  }

  function exposeAPI() {
    window.HomeProvinces = {
      reload: async () => {
        state.loaded = false;
        state.loading = false;
        await load();
      },
      render,
      getAll: () => [...state.provinces],
      getFiltered: () => [...state.filtered],
      getBySlug: (slug) => state.provinces.find((p) => p.slug === slug) || null,
    };
  }

  function init() {
    if (!listEl) return;

    bindEvents();
    exposeAPI();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", load, { once: true });
    } else {
      load();
    }
  }

  init();
})();
