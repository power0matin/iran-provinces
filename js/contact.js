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
      const t = document.createElement("div");
      t.className = `toast ${type}`;
      t.innerHTML = `
        <i class="fa-${
          type === "success"
            ? "regular fa-circle-check"
            : "solid fa-triangle-exclamation"
        }"></i>
        <span>${msg}</span>
        <i class="close fa-regular fa-xmark" role="button" tabindex="0" aria-label="close"></i>
      `;
      this.host.appendChild(t);
      const close = () => t.remove();
      t.querySelector(".close")?.addEventListener("click", close);
      setTimeout(close, timeout);
    },
  };

  /* ---------- Helpers ---------- */
  const LSK = "contactDraft";
  function saveDraft() {
    const draft = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      subject: subjectEl.value,
      message: messageEl.value.trim(),
    };
    localStorage.setItem(LSK, JSON.stringify(draft));
  }
  function loadDraft() {
    try {
      const d = JSON.parse(localStorage.getItem(LSK) || "{}");
      if (d.name) nameEl.value = d.name;
      if (d.email) emailEl.value = d.email;
      if (d.subject) subjectEl.value = d.subject;
      if (d.message) messageEl.value = d.message;
      updateCounter();
    } catch {}
  }
  function clearDraft() {
    localStorage.removeItem(LSK);
  }

  function updateCounter() {
    msgCount.textContent = String(messageEl.value.length);
  }

  function setInvalid(el, state) {
    el.classList.toggle("invalid", !!state);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function validate() {
    let ok = true;
    setInvalid(nameEl, !(nameEl.value.trim().length >= 2));
    if (nameEl.classList.contains("invalid")) ok = false;

    setInvalid(emailEl, !isEmail(emailEl.value.trim()));
    if (emailEl.classList.contains("invalid")) ok = false;

    setInvalid(messageEl, !(messageEl.value.trim().length >= 10));
    if (messageEl.classList.contains("invalid")) ok = false;

    // honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") ok = false;

    return ok;
  }

  /* ---------- Dropzone ---------- */
  function renderFiles(files) {
    fileList.innerHTML = "";
    Array.from(files)
      .slice(0, 5)
      .forEach((f) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${f.name} • ${Math.ceil(f.size / 1024)}KB</span>
                      <button type="button" class="btn ghost btn-remove"><i class="fa-regular fa-trash-can"></i></button>`;
        li.querySelector(".btn-remove").addEventListener("click", () => {
          const dt = new DataTransfer();
          Array.from(fileInput.files).forEach((x) => {
            if (x !== f) dt.items.add(x);
          });
          fileInput.files = dt.files;
          renderFiles(fileInput.files);
        });
        fileList.appendChild(li);
      });
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
  dropzone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag");
  });
  dropzone?.addEventListener("dragleave", () =>
    dropzone.classList.remove("drag")
  );
  dropzone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag");
    const files = e.dataTransfer.files;
    const dt = new DataTransfer();
    // append to existing (limit 5)
    Array.from(fileInput.files)
      .concat(Array.from(files))
      .slice(0, 5)
      .forEach((f) => dt.items.add(f));
    fileInput.files = dt.files;
    renderFiles(fileInput.files);
  });
  fileInput?.addEventListener("change", () => renderFiles(fileInput.files));

  /* ---------- Copy buttons (email) ---------- */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.getAttribute("data-copy"));
        TOAST.show("Copied!", "success");
      } catch {
        TOAST.show("Copy failed", "error");
      }
    });
  });

  /* ---------- Live events ---------- */
  messageEl?.addEventListener("input", () => {
    updateCounter();
    saveDraft();
  });
  nameEl?.addEventListener("input", saveDraft);
  emailEl?.addEventListener("input", saveDraft);
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
    if (!validate()) {
      TOAST.show(
        I18N.t("contact.err") || "Please check the form fields.",
        "error"
      );
      return;
    }

    // شبیه‌سازی ارسال (بدون بک‌اند)
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    submitBtn.innerHTML = `<i class="fa-solid fa-loader fa-spin"></i><span>${
      I18N.t("contact.sending") || "در حال ارسال..."
    }</span>`;

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
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      nav.classList.remove("open");
      backdrop.classList.remove("show");
      document.body.style.overflow = "";
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
