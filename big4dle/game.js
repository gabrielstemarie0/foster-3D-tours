(() => {
  const SPORTS = Object.keys(TEAMS);
  const MAX = 6;
  const $ = id => document.getElementById(id);

  // Deterministic PRNG so everyone gets the same flag and reveal order on a given day.
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  let edition = "current", mode = "daily", sport, pool, answer, order, guesses, over, won, key;

  function setup(m) {
    mode = m;
    const seed = m === "daily" ? today() : String(Math.random()) + Date.now();
    const r = rng(hash("big4dle:" + edition + ":" + seed));
    sport = SPORTS[Math.floor(r() * SPORTS.length)];
    pool = SPORTS.flatMap(s => TEAMS[s][edition]);
    const sp = pool.filter(t => t.sport === sport);
    answer = sp[Math.floor(r() * sp.length)].name;
    order = shuffle([0, 1, 2, 3, 4, 5], r);
    key = "b4-day-" + edition + "-" + seed;
    const saved = m === "daily" ? store.get(key, null) : null;
    guesses = saved ? saved.guesses : [];
    over = false; won = false;
    $("mode-btn").textContent = m === "daily" ? "Daily" : "Practice";
    $("flag").innerHTML = flagSVG(pool.find(t => t.name === answer));
    $("end").hidden = true;
    $("guess").value = "";
    render();
    if (guesses.length && (guesses.includes(answer) || guesses.length >= MAX)) finish(true);
  }

  function render() {
    const t = $("tiles"); t.innerHTML = "";
    const revealed = new Set(order.slice(0, over && !won ? 6 : guesses.length));
    if (over) order.forEach(i => revealed.add(i));
    for (let i = 0; i < 6; i++) {
      const d = document.createElement("div");
      d.className = "tile" + (revealed.has(i) ? " open" : "");
      d.textContent = revealed.has(i) ? "" : "?";
      t.append(d);
    }
    const ol = $("guesses"); ol.innerHTML = "";
    guesses.forEach(g => { const li = document.createElement("li"); li.className = g === answer ? "ok" : "no"; li.textContent = g; ol.append(li); });
    $("status").textContent = over ? "" : `Guess ${guesses.length + 1} of ${MAX}`;
    const a = pool.find(t => t.name === answer), n = guesses.length;
    $("league").textContent = (over || n >= 5) ? `${TEAMS[sport].emoji} ${TEAMS[sport].label} · ${a.div}` : n >= 3 ? `${TEAMS[sport].emoji} ${TEAMS[sport].label}` : "Sport revealed after guess 3";
    $("submit").disabled = $("guess").disabled = over;
  }

  function finish(restore) {
    over = true; won = guesses.includes(answer);
    render();
    $("status").textContent = "";
    $("end-title").textContent = won ? `Got it in ${guesses.length}! It's ${answer}.` : `It was ${answer}.`;
    const squares = guesses.map(g => g === answer ? "🟩" : "🟥").join("") + "⬜".repeat(MAX - guesses.length);
    $("share-text").textContent = `Big4dle ${edition === "alltime" ? "All-Time " : ""}${TEAMS[sport].emoji}${mode === "daily" ? " " + today() : ""} ${won ? guesses.length : "X"}/${MAX}\n${squares}`;
    const cap = pool.find(t => t.name === answer).cap;
    $("end-detail").textContent = cap ? `${COUNTRIES[cap.country]} flag · captain/star: ${cap.name}` : "";
    $("end").hidden = false;
    if (mode === "daily" && !restore) recordStats();
    showStats();
  }

  function recordStats() {
    const s = store.get("b4-stats-" + edition, { played: 0, wins: 0, streak: 0, last: "", dist: [0, 0, 0, 0, 0, 0] });
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yest = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    s.played++;
    if (won) { s.wins++; s.dist[guesses.length - 1]++; s.streak = s.last === yest || s.streak === 0 ? s.streak + 1 : 1; } else s.streak = 0;
    s.last = today();
    store.set("b4-stats-" + edition, s);
  }

  function showStats() {
    const s = store.get("b4-stats-" + edition, { played: 0, wins: 0, streak: 0 });
    $("streak").textContent = s.streak;
    $("stats").textContent = `Played ${s.played} · Won ${s.played ? Math.round(100 * s.wins / s.played) : 0}% · Streak ${s.streak}`;
  }

  // Autocomplete (narrowed to the sport once it has been revealed)
  const candidates = () => pool.filter(t => guesses.length < 3 && !over || t.sport === sport).map(t => t.name);
  let matches = [], sel = -1;
  function options() {
    const q = $("guess").value.trim().toLowerCase();
    matches = q ? candidates().filter(n => n.toLowerCase().includes(q) && !guesses.includes(n)) : [];
    
    sel = matches.length ? 0 : -1;
    const ul = $("options"); ul.innerHTML = "";
    matches.forEach((c, i) => { const li = document.createElement("li"); li.textContent = c; li.setAttribute("role", "option"); if (i === sel) li.className = "on"; li.onmousedown = e => { e.preventDefault(); submit(c); }; ul.append(li); });
    ul.hidden = !matches.length;
  }
  function move(d) { if (!matches.length) return; sel = (sel + d + matches.length) % matches.length; [...$("options").children].forEach((li, i) => li.className = i === sel ? "on" : ""); }

  function submit(code) {
    if (over || !code || guesses.includes(code)) return;
    guesses.push(code);
    if (mode === "daily") store.set(key, { guesses });
    $("guess").value = ""; options();
    if (code === answer || guesses.length >= MAX) finish(false); else render();
  }

  $("guess").addEventListener("input", options);
  $("guess").addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Escape") $("options").hidden = true;
  });
  $("guess").addEventListener("blur", () => setTimeout(() => $("options").hidden = true, 100));
  $("form").addEventListener("submit", e => {
    e.preventDefault();
    const q = $("guess").value.trim().toLowerCase();
    const exact = candidates().find(n => n.toLowerCase() === q);
    submit(exact || (sel >= 0 ? matches[sel] : null));
  });
  $("copy").onclick = async () => { try { await navigator.clipboard.writeText($("share-text").textContent); $("copy").textContent = "Copied!"; } catch { $("copy").textContent = "Copy failed"; } setTimeout(() => $("copy").textContent = "Copy result", 1500); };
  $("practice").onclick = () => setup("practice");
  $("mode-btn").onclick = () => setup(mode === "daily" ? "practice" : "daily");

  function setEdition(e) {
    edition = e;
    $("tab-current").setAttribute("aria-selected", e === "current");
    $("tab-alltime").setAttribute("aria-selected", e === "alltime");
    setup("daily");
  }
  $("tab-current").onclick = () => setEdition("current");
  $("tab-alltime").onclick = () => setEdition("alltime");
  setEdition("current");
})();
