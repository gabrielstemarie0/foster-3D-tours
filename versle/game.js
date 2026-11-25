(() => {
  const SONGS = (window.VERSLE || []).map(([t, o, v]) => ({ t, o, v })); // [[title, origin, verse], ...]
  const genre = "all";
  const $ = (id) => document.getElementById(id);
  const input = $("guess"), list = $("options"), statusEl = $("status");
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
  const dayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const hash = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  let mode = "daily", song, words, order, shown, guesses, done;
  const songs = () => SONGS;

  function pick(seed) {
    const s = songs(); song = s[seed % s.length];
    words = song.v.split(/\s+/);
    // order words are revealed in; ties on repeated words are fine
    const r = rng(seed ^ 0x9e3779b9), idx = words.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    order = idx;
  }
  function start(m) {
    mode = m; $("mode-btn").textContent = m === "daily" ? "Daily" : "Practice";
    guesses = []; done = false; shown = 1; input.disabled = false;
    $("end").hidden = true; $("again").hidden = m === "daily"; statusEl.textContent = "";
    pick(m === "daily" ? hash(`versle-${genre}-${dayKey()}`) : Math.floor(Math.random() * 1e9));
    if (m === "daily") {
      const sv = store.get("vs-daily-" + genre);
      if (sv && sv.day === dayKey()) { guesses = sv.g; shown = 1 + guesses.length; if (sv.done) done = true; }
    }
    draw(); renderLog(); if (done) finish(true);
  }
  function draw() {
    const open = new Set(order.slice(0, Math.min(shown, words.length)));
    if (done) words.forEach((_, i) => open.add(i));
    const v = $("verse"); v.innerHTML = "";
    words.forEach((w, i) => {
      const s = document.createElement("span"); s.className = "w " + (open.has(i) ? "show" : "box");
      s.textContent = open.has(i) ? w : "█".repeat(Math.max(2, Math.min(w.length, 9)));
      if (!open.has(i)) s.setAttribute("aria-label", "hidden word");
      v.appendChild(s);
    });
    $("meter").textContent = done ? "" : `${Math.min(shown, words.length)} of ${words.length} words shown · ${guesses.length} guess${guesses.length === 1 ? "" : "es"}`;
  }
  function renderLog() {
    const ol = $("log"); ol.innerHTML = "";
    guesses.slice().reverse().forEach((g) => {
      const li = document.createElement("li"); li.className = g.skip ? "skip" : "";
      li.textContent = g.skip ? "Skipped" : "✗ " + g.t; ol.appendChild(li);
    });
  }
  function save(win) { if (mode === "daily") store.set("vs-daily-" + genre, { day: dayKey(), g: guesses, done: win }); }
  function miss(g) { guesses.push(g); shown++; save(false); draw(); renderLog(); }
  function finish(restore) {
    done = true; input.disabled = true; $("end").hidden = false; draw();
    const n = guesses.length + 1;
    $("end-title").textContent = restore && guesses.length && guesses.at(-1).gave ? "Better luck tomorrow" : "You got it!";
    $("end-text").textContent = `${song.t} (${song.o})`;
    if (!restore) { guesses.push({ t: song.t, win: true }); save(true); }
    $("end-text").textContent += ` · ${guesses.filter((g) => !g.win).length + 1} guess${guesses.length ? "es" : ""}`.replace(/ · .*/, ` · solved in ${n} guess${n === 1 ? "" : "es"}`);
  }
  function submit(s) {
    if (done) return;
    if (!s) { statusEl.textContent = "Pick a song from the list."; return; }
    input.value = ""; render(); statusEl.textContent = "";
    if (s.t === song.t) { finish(false); return; }
    miss({ t: s.t });
  }

  let matches = [], sel = -1;
  function render() {
    const q = norm(input.value.trim()), used = new Set(guesses.map((g) => g.t));
    matches = q ? songs().filter((c) => !used.has(c.t) && norm(c.t).includes(q))
      .sort((a, b) => (norm(a.t).startsWith(q) ? 0 : 1) - (norm(b.t).startsWith(q) ? 0 : 1) || a.t.localeCompare(b.t)).slice(0, 8) : [];
    list.innerHTML = ""; sel = matches.length ? 0 : -1;
    matches.forEach((m, i) => {
      const li = document.createElement("li"); li.setAttribute("role", "option"); li.setAttribute("aria-selected", i === sel);
      li.innerHTML = "<span></span><small></small>"; li.firstChild.textContent = m.t; li.lastChild.textContent = m.o;
      li.addEventListener("mousedown", (e) => { e.preventDefault(); submit(m); });
      list.appendChild(li);
    });
    list.hidden = !matches.length; input.setAttribute("aria-expanded", !list.hidden);
  }
  function highlight(d) {
    if (!matches.length) return; sel = (sel + d + matches.length) % matches.length;
    [...list.children].forEach((li, i) => li.setAttribute("aria-selected", i === sel));
  }
  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); highlight(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlight(-1); }
    else if (e.key === "Escape") list.hidden = true;
  });
  input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 100));
  $("guess-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = norm(input.value.trim());
    submit(songs().find((c) => norm(c.t) === q) || matches[sel]);
  });
  $("skip").addEventListener("click", () => { if (!done) miss({ skip: true }); });

  $("help-btn").addEventListener("click", () => $("help").showModal());
  $("mode-btn").addEventListener("click", () => start(mode === "daily" ? "practice" : "daily"));
  $("again").addEventListener("click", () => start("practice"));
  $("share").addEventListener("click", async () => {
    const n = guesses.length;
    const text = `Versle ${mode === "daily" ? dayKey() : "(practice)"}\n${"🟥".repeat(Math.max(0, n - 1))}🟩 ${n}`;
    try { await navigator.clipboard.writeText(text); statusEl.textContent = "Copied!"; } catch { statusEl.textContent = text; }
  });
  start("daily");
  if (!store.get("vs-seen")) { store.set("vs-seen", 1); $("help").showModal(); }
})();
