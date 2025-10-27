// js/search-global.js — substring search + suggestions + navigation
(() => {
  const form   = document.getElementById('siteSearch');
  const input  = document.getElementById('searchInput');
  const clearB = document.getElementById('searchClear');

  if (!form || !input) return;

  // ---------- Utils ----------
  const normEn = (s="") => String(s)
    .toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[_-]+/g," ").replace(/[^a-z\s]/g," ").replace(/\s+/g," ").trim();
  const normFa = (s="") => String(s).replace(/\s+/g," ").trim();

  // Resolve which label to show (respect document dir)
  const showLabel = (p) => (document.dir || "ltr") === "rtl"
    ? (p.fa || p.en || "")
    : (p.en || p.fa || "");

  // Highlight a substring in a label (safe/cheap)
  function highlight(label, query) {
    if (!query) return escapeHtml(label);
    const q = (document.dir || "ltr") === "rtl" ? normFa(query) : normEn(query);
    const lNorm = (document.dir || "ltr") === "rtl" ? normFa(label) : normEn(label);
    const idx = lNorm.indexOf(q);
    if (idx < 0) return escapeHtml(label);
    // map back to original indices (approximate by counting codepoints)
    const pre  = label.slice(0, idx);
    const mid  = label.slice(idx, idx + query.length);
    const post = label.slice(idx + query.length);
    return `${escapeHtml(pre)}<mark>${escapeHtml(mid)}</mark>${escapeHtml(post)}`;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[m]));
  }

  // ---------- Data (maps) ----------
  const IdMap = { ready:false, en:new Map(), fa:new Map(), list:[] };

  async function loadMaps(){
    if (IdMap.ready) return;
    async function load(p){ try{ const r=await fetch(p,{cache:"no-store"}); return r.ok? r.json():null; }catch{return null;} }
    const slug = await (load("data/slug-map.json")) || [];
    const idx  = await (load("data/index.json")) || { provinces:[] };

    slug.forEach(it => {
      if (it.nameEn) IdMap.en.set(normEn(it.nameEn), it.id);
      if (it.matchEn)IdMap.en.set(normEn(it.matchEn), it.id);
      if (it.nameFa) IdMap.fa.set(normFa(it.nameFa), it.id);
    });
    (idx.provinces||[]).forEach(p=>{
      if (p.nameEn) IdMap.en.set(normEn(p.nameEn), p.id);
      if (p.nameFa) IdMap.fa.set(normFa(p.nameFa), p.id);
      IdMap.list.push({ id:p.id, fa:p.nameFa || "", en:p.nameEn || "" });
    });

    // common aliases
    IdMap.en.set("east azerbaijan","azarbaijan-east");
    IdMap.en.set("west azerbaijan","azarbaijan-west");
    IdMap.en.set("razavi khorasan","khorasan-razavi");
    IdMap.en.set("south khorasan","khorasan-south");
    IdMap.en.set("north khorasan","khorasan-north");
    IdMap.en.set("kohgiluyeh and boyer ahmad","kohgiluyeh-boyerahmad");

    IdMap.ready = true;
  }

  // ---------- Search (substring, scored) ----------
  /**
   * Score order:
   *   1) startsWith in FA/EN
   *   2) includes (substring) in FA/EN
   * Shorter names slightly preferred on ties.
   */
  function searchList(q, limit=8){
    if (!q) return [];
    const qFa = normFa(q), qEn = normEn(q);
    const items = [];
    for (const p of IdMap.list){
      const nFa = normFa(p.fa), nEn = normEn(p.en);
      let score = Infinity;
      if (qFa && nFa.startsWith(qFa)) score = Math.min(score, 10);
      if (qEn && nEn.startsWith(qEn)) score = Math.min(score, 10);
      if (qFa && nFa.includes(qFa))  score = Math.min(score, 20);
      if (qEn && nEn.includes(qEn))  score = Math.min(score, 20);
      if (score < Infinity) {
        // small tie-breakers
        score += Math.min(nFa.length || nEn.length, 60) / 100;
        items.push({ p, score });
      }
    }
    return items.sort((a,b)=>a.score-b.score).slice(0, limit).map(x=>x.p);
  }

  // ---------- Suggestions UI ----------
  // Make form positioning context & list container
  form.style.position = form.style.position || "relative";
  const list = document.createElement("div");
  list.className = "sb-suggest";
  list.setAttribute("role","listbox");
  list.setAttribute("id","sb-suggest");
  list.hidden = true;
  form.appendChild(list);

  // Minimal styles (safe defaults; feel free to style in CSS)
  Object.assign(list.style, {
    position: "absolute",
    insetInline: "0",
    top: "calc(100% + 6px)",
    background: "var(--card, #fff)",
    border: "1px solid var(--border, rgba(0,0,0,.12))",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,.12)",
    padding: "6px",
    maxHeight: "60vh",
    overflow: "auto",
    zIndex: "10000"
  });

  function renderList(q){
    const results = searchList(q);
    if (!results.length){ hideList(); return; }
    list.hidden = false;
    list.innerHTML = results.map((p,i)=>{
      const label = showLabel(p);
      const html = highlight(label, q);
      return `
        <button type="button" role="option" class="sb-item" data-id="${p.id}" aria-selected="${i===0?'true':'false'}">
          <span class="sb-label">${html}</span>
        </button>
      `;
    }).join("");
    // basic item styles
    list.querySelectorAll(".sb-item").forEach(btn=>{
      Object.assign(btn.style, {
        display:"block", width:"100%", textAlign:"start",
        background:"transparent", border:"0", borderRadius:"10px",
        padding:"10px 12px", cursor:"pointer", color:"var(--text, #222)",
      });
      btn.onmouseenter = () => setActive(btn);
      btn.onmousedown  = (e) => e.preventDefault(); // keep focus on input
      btn.onclick = () => go(btn.dataset.id);
    });
  }

  function hideList(){ list.hidden = true; list.innerHTML = ""; activeIndex = -1; }
  function go(id){ if (id) location.href = `province.html?id=${encodeURIComponent(id)}`; }

  // active item handling
  let activeIndex = -1;
  function setActive(el){
    list.querySelectorAll('.sb-item[aria-selected="true"]').forEach(n=>n.setAttribute("aria-selected","false"));
    el.setAttribute("aria-selected","true");
    activeIndex = Array.prototype.indexOf.call(list.children, el);
    const r = el.getBoundingClientRect();
    const L = list.getBoundingClientRect();
    if (r.top < L.top) list.scrollTop -= (L.top - r.top) + 6;
    else if (r.bottom > L.bottom) list.scrollTop += (r.bottom - L.bottom) + 6;
  }
  function activeEl(){ return list.hidden ? null : list.children[activeIndex]; }

  // ---------- Events ----------
  loadMaps();

  // Show suggestions as user types (debounced)
  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value.trim();
      if (!q) { hideList(); toggleClear(false); return; }
      renderList(q);
      toggleClear(q.length > 0);
    }, 80);
  });

  // Submit navigates to top suggestion (if any)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!list.hidden && list.children.length){
      const first = list.querySelector('.sb-item');
      if (first) return go(first.dataset.id);
    }
    // fallback: direct resolve (exact/startsWith/includes)
    const id = findIdByQuery(input.value.trim());
    if (id) go(id);
  });

  // Keyboard nav
  input.addEventListener("keydown", (e) => {
    if (list.hidden) return;
    const count = list.children.length;
    if (!count) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1 + count) % count;
      setActive(list.children[activeIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + count) % count;
      setActive(list.children[activeIndex]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const el = activeEl() || list.querySelector('.sb-item');
      if (el) go(el.dataset.id);
    } else if (e.key === "Escape") {
      hideList();
    }
  });

  // Global "/" to focus search (not when typing elsewhere)
  window.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    if (typing) return;
    e.preventDefault();
    input.focus(); input.select?.();
  });

  // Clear visibility (also works without :has())
  function toggleClear(on){
    if (!clearB) return;
    const show = on ?? input.value.trim().length > 0;
    clearB.hidden = !show;
    clearB.setAttribute("aria-hidden", String(!show));
  }
  clearB?.addEventListener("click", () => {
    input.value = ""; hideList(); toggleClear(false); input.focus();
  });

  // Click outside to close
  document.addEventListener("pointerdown", (e) => {
    if (form.contains(e.target)) return;
    hideList();
  });

  // ---------- Direct resolver for submit (contains) ----------
  function findIdByQuery(q){
    if (!q) return null;
    const qFa = normFa(q), qEn = normEn(q);

    // exact / startsWith first
    for (const p of IdMap.list){
      if ((p.fa && normFa(p.fa) === qFa) || (p.en && normEn(p.en) === qEn)) return p.id;
      if ((p.fa && normFa(p.fa).startsWith(qFa)) || (p.en && normEn(p.en).startsWith(qEn))) return p.id;
    }
    // then includes
    for (const p of IdMap.list){
      if ((p.fa && normFa(p.fa).includes(qFa)) || (p.en && normEn(p.en).includes(qEn))) return p.id;
    }
    // aliases
    if (IdMap.fa.has(qFa)) return IdMap.fa.get(qFa);
    if (IdMap.en.has(qEn)) return IdMap.en.get(qEn);
    return null;
  }

  // init clear state
  toggleClear(false);
})();
