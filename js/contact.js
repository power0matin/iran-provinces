// js/contact.js
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const form = $("#contactForm");
  const nameEl = $("#name");
  const emailEl = $("#email");
  const subjectEl = $("#subject");
  const messageEl = $("#message");
  const submitBtn = $("#submitBtn");
  const resetBtn = $("#resetBtn");
  const msgCount = $("#msgCount");

  const dropzone = $("#dropzone");
  const fileInput = $("#attachments");
  const fileList = $("#fileList");

  const TOAST = {
    host: $("#toastHost"),
    show(msg, type = "success", timeout = 4000) {
      if (!this.host) return;

      this.host.setAttribute(
        "aria-live",
        type === "success" ? "polite" : "assertive"
      );

      // ساخت نوتیف
      const t = document.createElement("div");
      t.className = `toast ${type}`;
      t.setAttribute("role", type === "success" ? "status" : "alert");

      const icon = document.createElement("i");
      icon.className =
        type === "success"
          ? "fa-regular fa-circle-check"
          : "fa-solid fa-triangle-exclamation";

      const span = document.createElement("span");
      span.textContent = msg;

      const close = document.createElement("i");
      close.className = "close fa-solid fa-xmark";
      close.setAttribute("role", "button");
      close.setAttribute("tabindex", "0");
      close.setAttribute("aria-label", "close");

      t.append(icon, span, close);
      this.host.appendChild(t);

      // ---- ENTER: از راست -> جای‌گذاری + در فریم بعدی کلاس نمایش
      requestAnimationFrame(() => t.classList.add("toast--show"));

      // ---- تایمر با توقف روی هاور
      let timer = setTimeout(startLeave, timeout);
      const pause = () => {
        clearTimeout(timer);
        timer = null;
      };
      const resume = () => {
        if (!t._leaving && !timer) timer = setTimeout(startLeave, 1200);
      };

      t.addEventListener("mouseenter", pause);
      t.addEventListener("mouseleave", resume);

      // بستن دستی
      const onClickClose = () => startLeave();
      const onKeyClose = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startLeave();
        }
      };
      close.addEventListener("click", onClickClose);
      close.addEventListener("keydown", onKeyClose);
      t.addEventListener("keydown", (e) => {
        if (e.key === "Escape") startLeave();
      });

      // ---- LEAVE + COLLAPSE (از راست خارج شود و ارتفاع جمع شود)
      function startLeave() {
        if (t._leaving) return;
        t._leaving = true;
        pause();

        // 1) معکوس ورود (slide به راست + fade)
        t.classList.remove("toast--show");
        t.classList.add("toast--leaving");

        // 2) پس از پایان slide/fade، ارتفاع را با انیمیشن جمع کن
        t.addEventListener("transitionend", onFadeDone, { once: true });
      }

      function onFadeDone(ev) {
        // فقط بعد از پایان transitionِ opacity یا transform
        if (ev.propertyName !== "opacity" && ev.propertyName !== "transform")
          return;

        // اندازه‌های جاری را قفل کن تا قابل انیمیت شوند
        const cs = getComputedStyle(t);
        const h = t.offsetHeight; // شامل padding
        t.style.height = h + "px";
        t.style.marginTop = cs.marginTop;
        t.style.marginBottom = cs.marginBottom;
        t.style.paddingTop = cs.paddingTop;
        t.style.paddingBottom = cs.paddingBottom;
        t.style.borderTopWidth = cs.borderTopWidth;
        t.style.borderBottomWidth = cs.borderBottomWidth;

        // 3) کلاس collapse و مقادیر هدف صفر
        t.classList.add("toast--collapse");
        // فریم بعدی تا مرورگر مقادیر شروع را ثبت کند
        requestAnimationFrame(() => {
          t.style.height = "0px";
          t.style.marginTop = "0px";
          t.style.marginBottom = "0px";
          t.style.paddingTop = "0px";
          t.style.paddingBottom = "0px";
          t.style.borderTopWidth = "0px";
          t.style.borderBottomWidth = "0px";
        });

        // 4) پس از اتمام transitionِ ارتفاع، حذف نهایی
        t.addEventListener(
          "transitionend",
          (e2) => {
            if (e2.propertyName === "height") t.remove();
          },
          { once: true }
        );
      }
    },
  };

  /* ---------- Helpers ---------- */
  const LSK = "contactDraft";
  let draftTimer = null;
  function saveDraft() {
    const draft = {
      name: nameEl?.value.trim() || "",
      email: emailEl?.value.trim() || "",
      subject: subjectEl?.value || "",
      message: messageEl?.value.trim() || "",
    };
    // debounce + safe storage
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      try {
        localStorage.setItem(LSK, JSON.stringify(draft));
      } catch {}
    }, 300);
  }
  function loadDraft() {
    try {
      const raw = localStorage.getItem(LSK);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.name) nameEl.value = d.name;
      if (d.email) emailEl.value = d.email;
      if (d.subject) subjectEl.value = d.subject;
      if (d.message) messageEl.value = d.message;
      updateCounter();
    } catch {}
  }
  function clearDraft() {
    try {
      localStorage.removeItem(LSK);
    } catch {}
  }

  function updateCounter() {
    msgCount.textContent = String(messageEl.value.length);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function setInvalid(el, state) {
    const isBad = !!state;
    el.classList.toggle("invalid", isBad);
    el.setAttribute("aria-invalid", String(isBad));
  }
  function validate() {
    let ok = true;
    let firstBad = null;

    const badName = nameEl.value.trim().length < 2;
    setInvalid(nameEl, badName);
    if (badName) {
      ok = false;
      firstBad ??= nameEl;
    }

    const badEmail = !isEmail(emailEl.value.trim());
    setInvalid(emailEl, badEmail);
    if (badEmail) {
      ok = false;
      firstBad ??= emailEl;
    }

    const badMsg = messageEl.value.trim().length < 10;
    setInvalid(messageEl, badMsg);
    if (badMsg) {
      ok = false;
      firstBad ??= messageEl;
    }

    // honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") ok = false;

    return { ok, firstBad };
  }

  /* ---------- Dropzone ---------- */
  const MAX_FILES = 5;
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPT = []; // مثلا ['image/png','image/jpeg'] اگر محدودیت داری

  function validFile(f) {
    if (ACCEPT.length && !ACCEPT.includes(f.type)) return false;
    if (f.size > MAX_SIZE) return false;
    return true;
  }

  function renderFiles(files) {
    fileList.innerHTML = "";
    const frag = document.createDocumentFragment();
    Array.from(files)
      .slice(0, MAX_FILES)
      .forEach((f, idx) => {
        const li = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = `${f.name} • ${Math.ceil(f.size / 1024)}KB`;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn ghost btn-remove";
        btn.innerHTML = `<i class="fa-regular fa-trash-can" aria-hidden="true"></i>`;
        btn.setAttribute("aria-label", "remove file");

        btn.addEventListener("click", () => {
          const dt = new DataTransfer();
          Array.from(fileInput.files).forEach((x, i) => {
            if (i !== idx) dt.items.add(x);
          });
          fileInput.files = dt.files;
          renderFiles(fileInput.files);
        });

        li.append(name, btn);
        frag.appendChild(li);
      });
    fileList.appendChild(frag);
  }

  function openFilePicker() {
    fileInput.click();
  }

  dropzone?.addEventListener("click", openFilePicker);
  dropzone?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  });
  let dragDepth = 0;
  dropzone?.addEventListener("dragover", (e) => {
    e.preventDefault(); // لازم برای drop
  });
  dropzone?.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragDepth++;
    dropzone.classList.add("drag");
  });
  dropzone?.addEventListener("dragleave", () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropzone.classList.remove("drag");
  });
  dropzone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDepth = 0;
    dropzone.classList.remove("drag");

    const incoming = Array.from(e.dataTransfer.files).filter(validFile);
    const merged = Array.from(fileInput.files)
      .concat(incoming)
      .slice(0, MAX_FILES);

    const dt = new DataTransfer();
    merged.forEach((f) => dt.items.add(f));
    fileInput.files = dt.files;
    renderFiles(fileInput.files);

    if (incoming.length === 0) {
      TOAST.show(
        I18N.t("contact.badFile") || "File type/size not allowed.",
        "error"
      );
    }
  });
  fileInput?.addEventListener("change", () => {
    const filtered = Array.from(fileInput.files)
      .filter(validFile)
      .slice(0, MAX_FILES);
    const dt = new DataTransfer();
    filtered.forEach((f) => dt.items.add(f));
    fileInput.files = dt.files;
    renderFiles(fileInput.files);
  });

  fileInput?.addEventListener("change", () => renderFiles(fileInput.files));

  /* ---------- Copy buttons (email) ---------- */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          btn.getAttribute("data-copy") || ""
        );
        TOAST.show(I18N.t("copy.ok") || "Copied!", "success");
      } catch {
        TOAST.show(I18N.t("copy.fail") || "Copy failed", "error");
      }
    });
  });

  /* ---------- Live events ---------- */
  const clearInvalidOnInput = (el) => {
    el.addEventListener("input", () => {
      if (el.classList.contains("invalid")) setInvalid(el, false);
      saveDraft();
      if (el === messageEl) updateCounter();
    });
  };
  [nameEl, emailEl, messageEl].forEach((el) => el && clearInvalidOnInput(el));
  subjectEl?.addEventListener("change", saveDraft);

  resetBtn?.addEventListener("click", () => {
    form.reset();
    renderFiles([]);
    clearDraft();
    updateCounter();
    $$("input,textarea,select", form).forEach((el) =>
      el.classList.remove("invalid")
    );
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { ok, firstBad } = validate();
    if (!ok) {
      TOAST.show(
        I18N.t("contact.err") || "Please check the form fields.",
        "error"
      );
      firstBad?.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>${
      I18N.t("contact.sending") || "در حال ارسال..."
    }</span>`;

    // شبیه‌سازی ارسال
    await new Promise((r) => setTimeout(r, 1200));

    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    submitBtn.innerHTML = `<i class="fa-regular fa-paper-plane"></i><span>${
      I18N.t("contact.send") || "ارسال"
    }</span>`;

    TOAST.show(I18N.t("contact.sent") || "Sent successfully!", "success");
    form.reset();
    renderFiles([]);
    clearDraft();
    updateCounter();
  });

  /* ---------- Header basic (drawer) ---------- */
  (function header() {
    const nav = $("#mainNav");
    const toggle = $("#navToggle");
    const backdrop = $("#navBackdrop");
    const open = () => {
      nav.classList.add("open");
      backdrop.classList.add("show");
      document.body.classList.add("nav-locked"); // با CSS قبلی تو سازگاره
    };
    const close = () => {
      nav.classList.remove("open");
      backdrop.classList.remove("show");
      document.body.classList.remove("nav-locked");
    };

    toggle?.addEventListener("click", () =>
      nav.classList.contains("open") ? close() : open()
    );
    backdrop?.addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  })();

  /* ---------- i18n sync ---------- */
  function applyDynamicI18n() {
    // placeholderهای پویا
    const namePh = I18N.t("contact.namePlaceholder") || "نام شما";
    const msgPh =
      I18N.t("contact.messagePlaceholder") || "پیام خود را بنویسید…";
    nameEl.setAttribute("placeholder", namePh);
    messageEl.setAttribute("placeholder", msgPh);
  }
  window.addEventListener("langchange", applyDynamicI18n);

  /* ---------- Boot ---------- */
  (function boot() {
    // سال فوتر
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
    // درفت قبلی
    loadDraft();
    applyDynamicI18n();
  })();
})();
