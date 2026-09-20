# 🗺️ نقشه تعاملی استان‌های ایران

یک پروژه‌ی **وب مدرن و واکنش‌گرا** برای نمایش و کاوش **استان‌های ایران** به‌صورت تعاملی همراه با اطلاعات کامل و تصاویر مرتبط.
این پروژه با vanilla HTML/CSS/JS و بدون مرحله‌ی build ساخته شده (Leaflet، Font Awesome و فونت وزیرمتن از CDN بارگذاری می‌شوند) و برای میزبانی روی **GitHub Pages** کاملاً بهینه است.

[🌐 مشاهده نسخه زنده](https://power0matin.github.io/iran-provinces/)

## ✨ ویژگی‌ها

- 🗺️ **نقشه تعاملی** (Leaflet + GeoJSON) با قابلیت کلیک روی هر استان
- 🏞️ **صفحه‌ی اختصاصی برای هر استان** همراه با توضیحات، جمعیت، مساحت و جاذبه‌ها
- 🌑 **حالت تاریک، روشن و خودکار** هماهنگ با سیستم کاربر و بدون پرش تم
- 🌐 **دو زبانه (فارسی / انگلیسی)** با تغییر زبان سریع و جهت مناسب صفحه (RTL/LTR)
- 🧭 **رابط کاربری ساده و قابل استفاده** برای جستجو و ناوبری راحت
- 🔎 **آماده‌ی سئو**: عنوان، توضیحات، canonical، Open Graph و JSON-LD اختصاصی هر استان و فایل `sitemap.xml`
- ⚡ **سرعت بالا** به دلیل استفاده از فایل‌های استاتیک و تصاویر بهینه‌شده

## 📸 تصاویر

### ☀️ صفحه اصلی

![Homepage](images/new_version_preview_light.png)

### 🌙 حالت تاریک

![Dark Mode](images/new_version_preview_dark.png)

## 🧱 ساختار پروژه

```
iran-provinces/
├─ index.html             # صفحه اصلی (نقشه و لیست استان‌ها)
├─ province.html          # جزئیات استان‌ها
├─ about.html             # درباره ما
├─ contact.html           # تماس
├─ manifest.json
├─ sitemap.xml            # تولید با: node tools/build-sitemap.mjs
├─ css/
│  ├─ style.css           # استایل کلی و توکن‌های تم
│  ├─ components.css      # کامپوننت‌ها (تب، کارت، چپ، …)
│  ├─ map.css             # نقشه Leaflet و تولتیپ
│  └─ responsive.css      # واکنش‌گرایی
├─ js/
│  ├─ i18n.js             # ترجمه و تغییر زبان
│  ├─ darkMode.js         # تم (روشن/تاریک/خودکار) — بارگذاری در <head>
│  ├─ site.js             # سال فوتر و میانبر صفحه‌کلید
│  ├─ home.js             # لیست و جستجوی صفحه اصلی
│  ├─ map.js              # نقشه Leaflet و لایه GeoJSON
│  ├─ search-global.js    # پیشنهاد جستجوی هدر
│  ├─ province.js         # نمایش اطلاعات و تگ‌های سئوی استان
│  └─ contact.js          # فرم تماس (باز کردن mailto آماده)
├─ data/
│  ├─ provinces/
│  │  ├─ index.json       # اطلاعات همه استان‌ها
│  │  └─ slug-map.json    # نام GeoJSON ← شناسه استان
│  └─ geo/
│     └─ iran-provinces.geojson   # مرز استان‌ها (با id/nameFa/nameEn)
├─ tools/
│  ├─ enrich-geojson.js   # افزودن id/nameFa/nameEn به GeoJSON
│  ├─ build-sitemap.mjs   # تولید sitemap.xml
│  └─ validate-data.mjs   # اعتبارسنجی داده، شناسه‌ها، کلیدهای i18n و sitemap (CI)
├─ icons/  images/  assets/
├─ .github/workflows/ci.yml
├─ README.md
├─ README_FA.md
└─ LICENSE
```

## 🚀 نحوه راه‌اندازی محلی

```bash
# 1) کلون کردن
git clone https://github.com/power0matin/iran-provinces.git
cd iran-provinces

# 2) راه‌اندازی سرور محلی (یکی از گزینه‌ها را انتخاب کنید)
npx serve .
# یا
npx http-server .
# یا
python3 -m http.server

# 3) مشاهده در مرورگر
# http://localhost:5000
```

> ❗ توجه: اگر پروژه را مستقیماً با `file://` باز کنید، مرورگر به دلایل امنیتی دسترسی به فایل JSON را مسدود می‌کند. لطفاً از یک سرور محلی استفاده کنید.

## 🌐 تغییر زبان (FA / EN)

- از دکمه‌ی زبان در هدر برای تغییر بین فارسی و انگلیسی استفاده کنید.
- ترجمه‌ها به صورت زنده و بدون رفرش شدن صفحه اعمال می‌شوند.
- جهت صفحه و زبان HTML نیز به صورت خودکار تنظیم می‌شود.
- هر کلید ترجمه باید هم در `fa` و هم در `en` داخل `i18n.js` تعریف شود (CI کلیدهای ناموجود را رد می‌کند).

## 🌙 حالت تاریک

- حالت تاریک با انیمیشن؛ با راست‌کلیک روی سوئیچ، حالت **خودکار** (هماهنگ با سیستم) فعال می‌شود
- ذخیره وضعیت انتخاب‌شده در `localStorage` و همگام‌سازی بین تب‌ها
- پالت رنگی: فیروزه‌ای نیشابور روی زمینه‌ی کاغذی (روشن) / سبز-مشکی (تاریک)

## 🗃 فرمت داده‌ها

اطلاعات از فایل `data/provinces/index.json` بارگذاری می‌شود:

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
      "intro": "معرفی کوتاه استان...",
      "introEn": "Short intro...",
      "hero": "images/alborz_1.jpg",
      "counties": [{ "name": "کرج", "cities": ["کرج", "ماهدشت"] }],
      "cities": ["کرج", "هشتگرد", "نظرآباد", "فردیس"],
      "attractions": ["جاده چالوس", "پیست دیزین"]
    }
  ]
}
```

فیلدهای الزامی: `id`، `nameFa`، `nameEn`، `capital`، `capitalEn`، `intro`، `introEn`، `population`، `areaKm2` و `hero`. چندضلعی‌های نقشه هم با همین `id` به استان وصل می‌شوند (`data/geo/iran-provinces.geojson` و `data/provinces/slug-map.json`).

## ➕ افزودن یا ویرایش استان

1. وارد `data/provinces/index.json` شوید.
2. اطلاعات استان را طبق ساختار بالا اضافه یا ویرایش کنید.
3. تصویر استان را (JPEG واقعی، حدود ۱۰۰۰ پیکسل عرض و چند صد کیلوبایت) در مسیر `images/` قرار دهید.
4. دستورهای `node tools/build-sitemap.mjs` و `node tools/validate-data.mjs` را اجرا کنید.
5. تغییرات را پوش کرده و GitHub Pages به صورت خودکار نسخه‌ی جدید را منتشر می‌کند.

> ✅ توصیه: شناسه‌ی استان‌ها را حروف کوچک و بدون فاصله قرار دهید (از `-` استفاده کنید).

## ⌨️ میانبرهای صفحه‌کلید

- `/` → فوکوس روی جستجو
- `Esc` → پاک کردن جستجو

## 🤝 مشارکت در پروژه

ما از مشارکت شما استقبال می‌کنیم 🙌

### الگوی کامیت‌ها (Conventional Commits)

```
feat: افزودن اطلاعات استان گلستان
fix(i18n): اصلاح ترجمه‌ی برچسب‌های هدر
chore(css): بهبود استایل واکنش‌گرا
```

### چک‌لیست برای PR

- [ ] دستور `node tools/validate-data.mjs` بدون خطا اجرا می‌شود
- [ ] ترجمه‌ها برای FA/EN به‌روزرسانی شده‌اند
- [ ] تست محلی انجام شده است
- [ ] در حالت روشن و تاریک بررسی شده است

## 🗺 نقشه راه

- [ ] گالری تصاویر برای هر استان
- [ ] حالت آفلاین (Service Worker)
- [ ] نمودار جمعیت و آمار
- [ ] تست واحد برای بارگذاری داده‌ها
- [ ] خروجی CSV/JSON

## 📜 مجوز

این پروژه تحت مجوز **MIT License** منتشر شده است.
اطلاعات بیشتر در فایل [LICENSE](LICENSE)
.

## 📬 ارتباط با من

**Matin Shahabadi (متین شاه‌آبادی / متین شاه آبادی)**

وب‌سایت: [matinshahabadi.ir](https://matinshahabadi.ir)

- ایمیل: [me@matinshahabadi.ir](mailto:me@matinshahabadi.ir)
- گیت‌هاب: [power0matin](https://github.com/power0matin)
- لینکدین: [matin-shahabadi](https://www.linkedin.com/in/matin-shahabadi)

© 2024 تمامی حقوق محفوظ است.
