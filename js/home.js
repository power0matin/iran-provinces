// js/home.js  (use I18N consistently + listen to 'langchange')
(() => {
  const LIST = document.getElementById("provinceList");
  const BADGE = document.getElementById("countBadge");
  const SEARCH =
    document.getElementById("searchInput") ||
    document.getElementById("searchInput2");
  const ENDPOINT = "data/provinces/index.json";

  // fallback اگر فایل data نبود هم کار کند
  const FALLBACK = [
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
      names: { fa: "چهارمحال و بختیاری", en: "Chaharmahal & Bakhtiari" },
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
      names: { fa: "کهگیلویه و بویراحمد", en: "Kohgiluyeh & Boyer-Ahmad" },
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
      names: { fa: "سیستان و بلوچستان", en: "Sistan & Baluchestan" },
    },
    { slug: "tehran", names: { fa: "تهران", en: "Tehran" } },
    { slug: "yazd", names: { fa: "یزد", en: "Yazd" } },
    { slug: "zanjan", names: { fa: "زنجان", en: "Zanjan" } },
  ];

  let provinces = [];

  const lang = () => (window.I18N?.get ? I18N.get() : "fa");
  window.addEventListener("langchange", () => render(SEARCH?.value || ""));

  const esc = (s = "") =>
    s.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );

  function render(filter = "") {
    if (!LIST) return;
    const q = filter.trim().toLowerCase();
    const items = provinces.filter((p) => {
      const fa = (p.names?.fa || "").toLowerCase();
      const en = (p.names?.en || "").toLowerCase();
      return !q || fa.includes(q) || en.includes(q);
    });

    LIST.innerHTML = items
      .map(
        (p) => `
      <li data-name="${esc(p.slug)}">
        <a class="province" href="province.html?id=${encodeURIComponent(
          p.slug
        )}">
          ${esc(nameOf(p))}
        </a>
      </li>`
      )
      .join("");

    if (BADGE) BADGE.textContent = String(items.length);
  }

  async function load() {
    try {
      const r = await fetch(ENDPOINT, { cache: "no-store" });
      const data = await r.json();
      provinces = Array.isArray(data) ? data : FALLBACK;
    } catch {
      provinces = FALLBACK;
    }
    render(SEARCH?.value || "");
  }

  SEARCH?.addEventListener("input", () => render(SEARCH.value));
  window.addEventListener("langchange", () => render(SEARCH?.value || ""));

  document.addEventListener("DOMContentLoaded", load);
})();
