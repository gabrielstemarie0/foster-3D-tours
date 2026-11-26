(() => {
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
  const getJSON = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); };

  // ---- song sources: "api" (Musixmatch via /api) or "local" (public-domain verses in data.js) ----
  const LOCAL = (window.VERSLE || []).map(([t, o, v], id) => ({ id, t, o, v }));
  let source = "api", catalog = [], puzzle = null, mode = "daily", order, shown, guesses, done, answer;

  async function loadPuzzle(m) {
    if (source === "api") {
      const q = m === "daily" ? `mode=daily&day=${dayKey()}` : "mode=practice";
      const d = await getJSON("/api/verse?" + q);
      return { verse: d.verse, token: d.token };
    }
    const s = m === "daily" ? LOCAL[hash("versle-" + dayKey()) % LOCAL.length] : LOCAL[Math.floor(Math.random() * LOCAL.length)];
    return { verse: s.v, song: s };
  }
  async function check(g, reveal) {
    if (source === "api") return getJSON(`/api/check?token=${encodeURIComponent(puzzle.token)}&guess=${g ? g.id : -1}${reveal ? "&reveal=1" : ""}`);
    const a = puzzle.song, ok = g && g.id === a.id;
    return { correct: !!ok, answer: ok || reveal ? { title: a.t, artist: a.o, id: a.id } : undefined };
  }
  const songs = () => (source === "api" ? catalog : LOCAL.map((s) => ({ id: s.id, t: s.t, o: s.o })));

  // ---- game state ----
  function shuffleOrder(n, seed) {
    const r = rng(seed), idx = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx;
  }
  async function start(m) {
    mode = m; $("mode-btn").textContent = m === "daily" ? "Daily" : "Practice";
    guesses = []; done = false; answer = null; shown = 1; input.disabled = true; $("end").hidden = true;
    $("again").hidden = m === "daily"; statusEl.textContent = "Loading verse…"; $("verse").innerHTML = ""; $("log").innerHTML = "";
    try { puzzle = await loadPuzzle(m); } catch { statusEl.textContent = "Couldn't load a verse. Try again in a moment."; return; }
    statusEl.textContent = ""; input.disabled = false;
    const words = puzzle.verse.split(/\s+/);
    order = shuffleOrder(words.length, hash(puzzle.verse));
    if (m === "daily") {
      const sv = store.get("vs-daily");
      if (sv && sv.day === dayKey()) { guesses = sv.g; shown = 1 + guesses.length; if (sv.answer) { answer = sv.answer; done = true; } }
    }
    draw(); renderLog(); if (done) showEnd(true);
  }
  function draw() {
    const words = puzzle.verse.split(/\s+/), open = new Set(order.slice(0, Math.min(shown, words.length)));
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
  function save() { if (mode === "daily") store.set("vs-daily", { day: dayKey(), g: guesses, answer }); }
  function showEnd(restore, gaveUp) {
    done = true; input.disabled = true; $("end").hidden = false; draw();
    const n = guesses.length + (gaveUp ? 0 : 1);
    $("end-title").textContent = gaveUp ? "Better luck next time" : "You got it!";
    $("end-text").textContent = `${answer.title} by ${answer.artist}` + (gaveUp ? "" : ` · solved in ${n} guess${n === 1 ? "" : "es"}`);
    if (!restore) save();
  }
  async function submit(s) {
    if (done) return;
    if (!s) { statusEl.textContent = "Pick a song from the list."; return; }
    input.value = ""; render(); statusEl.textContent = "";
    let r; try { r = await check(s); } catch { statusEl.textContent = "Couldn't check that guess. Try again."; return; }
    if (r.correct) { answer = r.answer; guesses.push({ id: s.id, t: s.t, win: true }); showEnd(false); return; }
    guesses.push({ id: s.id, t: s.t }); shown++; save(); draw(); renderLog();
  }
  function skip() { if (done) return; guesses.push({ skip: true }); shown++; save(); draw(); renderLog(); }
  async function giveUp() {
    if (done) return;
    try { const r = await check(null, true); answer = r.answer; showEnd(false, true); } catch { statusEl.textContent = "Couldn't reveal the answer. Try again."; }
  }

  // ---- search box ----
  let matches = [], sel = -1;
  function render() {
    const q = norm(input.value.trim()), used = new Set(guesses.map((g) => g.id));
    matches = q ? songs().filter((c) => !used.has(c.id) && (norm(c.t).includes(q) || norm(c.o).includes(q)))
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
    submit(songs().find((c) => norm(c.t) === q && !guesses.some((g) => g.id === c.id)) || matches[sel]);
  });
  $("skip").addEventListener("click", skip);
  $("giveup").addEventListener("click", giveUp);
  $("help-btn").addEventListener("click", () => $("help").showModal());
  $("mode-btn").addEventListener("click", () => start(mode === "daily" ? "practice" : "daily"));
  $("again").addEventListener("click", () => start("practice"));
  $("share").addEventListener("click", async () => {
    const n = guesses.length, text = `Versle ${mode === "daily" ? dayKey() : "(practice)"}\n${"🟥".repeat(Math.max(0, n - 1))}🟩 ${n}`;
    try { await navigator.clipboard.writeText(text); statusEl.textContent = "Copied!"; } catch { statusEl.textContent = text; }
  });

  // ---- boot: use the API when it is configured, otherwise fall back to local public-domain verses ----
  (async () => {
    try { catalog = (await getJSON("catalog.json")).map(([t, o], id) => ({ id, t, o })); await getJSON("/api/status"); source = "api"; }
    catch { source = "local"; }
    if (source === "local" && !LOCAL.length) { statusEl.textContent = "No songs are set up yet. See the README for adding a Musixmatch key."; input.disabled = true; return; }
    await start("daily");
    if (!store.get("vs-seen")) { store.set("vs-seen", 1); $("help").showModal(); }
  })();
})();
