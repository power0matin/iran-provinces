// js/contact.js
(function () {
  const $ = (s) => document.querySelector(s);
  const form =
    document.querySelector("form[data-contact]") ||
    document.querySelector("form");

  function toast(msg, ok = true) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      document.body.appendChild(t);
    }
    Object.assign(t.style, {
      position: "fixed",
      insetInlineEnd: "16px",
      insetBlockEnd: "16px",
      padding: "10px 14px",
      borderRadius: "12px",
      background: ok ? "#14532d" : "#4c0519",
      color: "#fff",
      zIndex: 9999,
      transition: "opacity .2s",
      opacity: "0",
    });
    t.textContent = msg;
    requestAnimationFrame(() => (t.style.opacity = "1"));
    setTimeout(() => {
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 200);
    }, 2400);
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name")?.value.trim();
    const email = $("#email")?.value.trim();
    const msg = $("#message")?.value.trim();
    if (!name || name.length < 2) return toast("نام معتبر نیست", false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast("ایمیل معتبر نیست", false);
    if (!msg || msg.length < 5) return toast("پیام خیلی کوتاه است", false);
    setTimeout(() => {
      form.reset();
      toast(I18N.current() === "fa" ? "پیام ارسال شد" : "Sent");
    }, 400);
  });
})();
