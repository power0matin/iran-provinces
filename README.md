# 🌍 Iran Provinces — Interactive Map & Directory

<!-- repo-badges:start -->
<p align="center">
  <a href="https://hits.sh/github.com/power0matin/iran-provinces/"><img src="https://hits.sh/github.com/power0matin/iran-provinces.svg?style=flat-square&amp;label=Views&amp;labelColor=18181B&amp;color=0EA5E9&amp;logo=github" alt="Repository Views"/></a>
  <a href="https://github.com/power0matin/iran-provinces/stargazers"><img src="https://img.shields.io/github/stars/power0matin/iran-provinces?style=flat-square&amp;label=Stars&amp;labelColor=18181B&amp;color=F59E0B&amp;logo=github&amp;logoColor=white" alt="GitHub Stars"/></a>
  <a href="https://github.com/power0matin/iran-provinces/forks"><img src="https://img.shields.io/github/forks/power0matin/iran-provinces?style=flat-square&amp;label=Forks&amp;labelColor=18181B&amp;color=6366F1&amp;logo=github&amp;logoColor=white" alt="GitHub Forks"/></a>
  <a href="https://github.com/power0matin/iran-provinces/issues"><img src="https://img.shields.io/github/issues/power0matin/iran-provinces?style=flat-square&amp;label=Issues&amp;labelColor=18181B&amp;color=22C55E&amp;logo=github&amp;logoColor=white" alt="GitHub Issues"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/power0matin/iran-provinces?style=flat-square&amp;label=License&amp;labelColor=18181B&amp;color=EF4444&amp;logo=github&amp;logoColor=white" alt="GitHub License"/></a>
</p>
<!-- repo-badges:end -->

> **Official project page:** [matinshahabadi.ir/projects/iran-provinces/](https://matinshahabadi.ir/projects/iran-provinces/)

[فارسی | Persian](README_FA.md)

[![GitHub Pages](https://img.shields.io/badge/pages-live-0b7a75?logo=github&logoColor=white)](https://power0matin.github.io/iran-provinces/)
[![License: MIT](https://img.shields.io/badge/License-MIT-success.svg)](LICENSE)
![Repo size](https://img.shields.io/github/repo-size/power0matin/iran-provinces?label=size)
![Last commit](https://img.shields.io/github/last-commit/power0matin/iran-provinces)
![Open issues](https://img.shields.io/github/issues/power0matin/iran-provinces)
![Stars](https://img.shields.io/github/stars/power0matin/iran-provinces?style=social)

A modern, responsive, bilingual (FA/EN) web app to **explore Iran’s provinces** with a **clickable map**, **search**, **animated dark mode**, and **rich province pages** (intro, counties, cities, attractions). Built with vanilla HTML/CSS/JS and **no build step** (Leaflet, Font Awesome and Vazirmatn load from CDNs)—perfect for GitHub Pages.

## ✨ Highlights

- 🗺️ **Interactive map** (Leaflet + GeoJSON) with province deep links
- 🔍 **Keyboard-first search** (`/` to focus, `Esc` to clear)
- 🌓 **Animated dark mode** (light / dark / auto) with persistence, no wrong-theme flash
- 🌐 **Full i18n**: Persian ⇄ English toggle, auto RTL/LTR + `dir`
- 📚 **Data-driven**: provinces from JSON (`data/provinces/index.json`)
- 📱 **Responsive** UI (sticky header, mobile-first layout)
- ♿ **A11y**: focus rings, ARIA labels, high-contrast friendly
- 🔎 **SEO-ready**: per-province title, description, canonical, Open Graph and JSON-LD, plus `sitemap.xml`
- ⚡ **Fast**: static assets only, optimized images, clean CSS transitions

## 🧭 Table of Contents

- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [i18n (FA/EN)](#i18n-faen)
- [Dark Mode](#dark-mode)
- [Data Format](#data-format)
- [Add or Edit a Province](#add-or-edit-a-province)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [CI / Pages](#ci--pages)
- [License](#license)
- [Credits](#credits)

## 🚀 Live Demo

👉 **[https://power0matin.github.io/iran-provinces/](https://power0matin.github.io/iran-provinces/)**

> Designed for static hosting (GitHub Pages or any CDN).

## 📸 Screenshots

**Home**
![Homepage](images/new_version_preview_light.png)

**Dark mode**
![Dark Mode](images/new_version_preview_dark.png)

## 🗂 Project Structure

```
iran-provinces/
├─ index.html           # Home (map + province list)
├─ province.html        # Province detail (intro, counties, cities, attractions)
├─ about.html
├─ contact.html
├─ manifest.json
├─ sitemap.xml          # Generated: node tools/build-sitemap.mjs
├─ css/
│  ├─ style.css         # Theme tokens, layout, base components
│  ├─ components.css    # Reusable UI (tabs, chips, cards, etc.)
│  ├─ map.css           # Leaflet map + tooltip
│  └─ responsive.css    # Breakpoints
├─ js/
│  ├─ i18n.js           # Dictionaries + lang/dir sync
│  ├─ darkMode.js       # Theme (light/dark/auto), loaded in <head>
│  ├─ site.js           # Footer year + keyboard shortcut
│  ├─ home.js           # Home list + search
│  ├─ map.js            # Leaflet map + GeoJSON layer
│  ├─ search-global.js  # Header search suggestions
│  ├─ province.js       # Province page renderer + SEO tags
│  └─ contact.js        # Contact form (opens a prefilled mailto)
├─ data/
│  ├─ provinces/
│  │  ├─ index.json     # All provinces metadata + content (SSOT)
│  │  └─ slug-map.json  # GeoJSON name → province id
│  └─ geo/
│     └─ iran-provinces.geojson   # Boundaries; features carry id/nameFa/nameEn
├─ tools/
│  ├─ enrich-geojson.js # Adds id/nameFa/nameEn to GeoJSON features
│  ├─ build-sitemap.mjs # Generates sitemap.xml from index.json
│  └─ validate-data.mjs # Data, map ids, i18n keys and sitemap checks (CI)
├─ icons/  images/  assets/
├─ .github/workflows/ci.yml
├─ README.md
├─ README_FA.md
└─ LICENSE
```

## 🧠 How It Works

- **Home** fetches `data/provinces/index.json` and renders the **31 provinces** list. The map draws `data/geo/iran-provinces.geojson`; every feature carries the province `id` and links to `province.html?id=<id>`.
- **Province detail** reads `id` from the query string, finds the object in `index.json`, then fills:
  - Chips: **capital**, **population**, **area**
  - **Intro** & **hero** image
  - **Counties** accordion (each with **cities**)
  - **Cities** & **Attractions** tiles

- **i18n**: updates `[data-i18n]` nodes and toggles `<html lang>` and `dir` (`rtl`/`ltr`).
- **Dark mode**: respects `prefers-color-scheme`, persists via `localStorage` and is applied from `<head>` to avoid a flash.
- **SEO**: `province.js` fills the title, description, canonical, Open Graph, Twitter tags and JSON-LD for the requested province; `sitemap.xml` lists every province URL.

## ⚡ Quick Start

```bash
# 1) Clone
git clone https://github.com/power0matin/iran-provinces.git
cd iran-provinces

# 2) Serve locally (choose one)
npx serve .
npx http-server .
python3 -m http.server

# 3) Open in browser
# http://localhost:5000   (or whatever your tool prints)
```

> Due to `fetch()` security, opening `index.html` via **file://** may block JSON loading—use a tiny local server.

## 🌐 i18n (FA/EN)

- Use the **Language** toggle in the header to switch **Persian ⇄ English**.
- `i18n.js`:
  - Updates all `[data-i18n]` texts on the fly
  - Sets `html[lang="fa"|"en"]` and `dir="rtl"|"ltr"`
  - Persists choice in `localStorage`

<details>
<summary>Extend translations</summary>

Add every key to **both** the `fa` and `en` dictionaries inside `i18n.js` (CI fails on missing keys). Elements containing markup use `data-i18n-html`. Example keys:

- `nav.home`, `nav.about`, `nav.contact`
- `home.provinces`, `home.hint`
- `province.intro`, `province.counties`, `province.cities`, `province.attractions`
- `province.aboutTitle`, `footer.rights`

</details>

## 🌙 Dark Mode

- Toggle in header (animated knob + glow)
- Right-click the toggle for **auto** mode (follows `prefers-color-scheme`)
- Persists in `localStorage` and syncs across tabs
- Palette: Neyshabur turquoise on warm paper (light) / ink teal (dark)

## 🗄 Data Format

All content comes from **`data/provinces/index.json`**:

```json
{
  "provinces": [
    {
      "id": "alborz",
      "nameFa": "البرز",
      "nameEn": "Alborz",
      "capital": "کرج",
      "capitalEn": "Karaj",
      "population": 3097000,
      "areaKm2": 5833,
      "intro": "متن معرفی...",
      "introEn": "Intro text...",
      "hero": "images/alborz_1.jpg",
      "counties": [{ "name": "کرج", "cities": ["کرج", "ماهدشت"] }],
      "cities": ["کرج", "هشتگرد", "نظرآباد", "فردیس"],
      "attractions": ["جاده چالوس", "پیست دیزین"]
    }
  ]
}
```

**Required:** `id`, `nameFa`, `nameEn`, `capital`, `capitalEn`, `intro`, `introEn`, `population`, `areaKm2`, `hero`
**Recommended:** `counties`, `cities`, `attractions`

Map polygons are matched by `id` (see `data/geo/iran-provinces.geojson` and `data/provinces/slug-map.json`).

## ➕ Add or Edit a Province

1. Edit `data/provinces/index.json`.
2. Add/modify a province object (see schema).
3. Place a real JPEG (about 1000 px wide, a few hundred KB) in `images/` and reference it via `hero`.
4. Run `node tools/build-sitemap.mjs` and `node tools/validate-data.mjs`.
5. Commit & push—Pages auto-publishes.

**Tip:** Keep `id` lowercase and URL-safe (`-` instead of spaces).

## ⌨️ Keyboard Shortcuts

- `/` → focus search
- `Esc` → clear search

## 🤝 Contributing

We welcome contributions!

**Conventional Commits** (recommended):

```
feat: add province Golestan data
fix(i18n): sync header label keys
chore(css): tidy responsive utilities
```

**PR Checklist**

- [ ] `node tools/validate-data.mjs` passes
- [ ] i18n keys updated for FA/EN
- [ ] Tested locally (home + province deep link)
- [ ] Screens OK in light & dark themes

> Consider opening an issue first for larger features.

## 🗺 Roadmap

- [ ] Province photo galleries
- [ ] Offline cache (Service Worker)
- [ ] Charts (e.g., population over time)
- [ ] Unit tests for loaders/renderers
- [ ] CSV/JSON export

## 🧩 CI / Pages

Deployed with **GitHub Pages** (Settings → Pages → _Deploy from_ `main`, `/`).

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests. It checks JavaScript syntax and runs `node tools/validate-data.mjs`, which verifies the province data, the GeoJSON/slug-map ids, the FA/EN i18n keys used in the HTML, hero image formats and that `sitemap.xml` is up to date.

> `robots.txt` is only honored at the domain root, so submit `sitemap.xml` in Search Console (or reference it from the root `robots.txt` of `power0matin.github.io`).

## 📜 License

Released under the **MIT License**.
See [LICENSE](LICENSE) for details.

## 📬 Contact

**Matin Shahabadi (متین شاه‌آبادی / متین شاه آبادی)**

- Website: [matinshahabadi.ir](https://matinshahabadi.ir)
- Email: [me@matinshahabadi.ir](mailto:me@matinshahabadi.ir)
- GitHub: [power0matin](https://github.com/power0matin)
- LinkedIn: [matin-shahabadi](https://www.linkedin.com/in/matin-shahabadi)

## 🙌 Credits

Designed & developed by **[@power0matin](https://github.com/power0matin)**.
Map image & province boundaries: public educational resources—open an issue if attribution needs adjustment.
