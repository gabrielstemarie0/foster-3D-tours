(() => {
  const STATES = {
    al:"Alabama",ak:"Alaska",az:"Arizona",ar:"Arkansas",ca:"California",co:"Colorado",ct:"Connecticut",de:"Delaware",
    fl:"Florida",ga:"Georgia",hi:"Hawaii",id:"Idaho",il:"Illinois",in:"Indiana",ia:"Iowa",ks:"Kansas",ky:"Kentucky",
    la:"Louisiana",me:"Maine",md:"Maryland",ma:"Massachusetts",mi:"Michigan",mn:"Minnesota",ms:"Mississippi",mo:"Missouri",
    mt:"Montana",ne:"Nebraska",nv:"Nevada",nh:"New Hampshire",nj:"New Jersey",nm:"New Mexico",ny:"New York",
    nc:"North Carolina",nd:"North Dakota",oh:"Ohio",ok:"Oklahoma",or:"Oregon",pa:"Pennsylvania",ri:"Rhode Island",
    sc:"South Carolina",sd:"South Dakota",tn:"Tennessee",tx:"Texas",ut:"Utah",vt:"Vermont",va:"Virginia",
    wa:"Washington",wv:"West Virginia",wi:"Wisconsin",wy:"Wyoming"
  };
  const CODES = Object.keys(STATES).sort((a, b) => STATES[a].localeCompare(STATES[b]));
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

  let mode = "daily", answer, order, guesses, over, won, key;

  function setup(m) {
    mode = m;
    const seed = m === "daily" ? today() : String(Math.random()) + Date.now();
    const r = rng(hash("stateflagle:" + seed));
    answer = CODES[Math.floor(r() * CODES.length)];
    order = shuffle([0, 1, 2, 3, 4, 5], r);
    key = "sf-day-" + seed;
    const saved = m === "daily" ? store.get(key, null) : null;
    guesses = saved ? saved.guesses : [];
    over = false; won = false;
    $("mode-btn").textContent = m === "daily" ? "Daily" : "Practice";
    $("flag").src = `flags/${answer}.png`;
    $("flag").alt = "";
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
    guesses.forEach(g => { const li = document.createElement("li"); li.className = g === answer ? "ok" : "no"; li.textContent = STATES[g]; ol.append(li); });
    $("status").textContent = over ? "" : `Guess ${guesses.length + 1} of ${MAX}`;
    $("submit").disabled = $("guess").disabled = over;
  }

  function finish(restore) {
    over = true; won = guesses.includes(answer);
    render();
    $("status").textContent = "";
    $("flag").alt = STATES[answer] + " flag";
    $("end-title").textContent = won ? `Got it in ${guesses.length}! It's ${STATES[answer]}.` : `It was ${STATES[answer]}.`;
    const squares = guesses.map(g => g === answer ? "🟩" : "🟥").join("") + "⬜".repeat(MAX - guesses.length);
    $("share-text").textContent = `State Flagle${mode === "daily" ? " " + today() : ""} ${won ? guesses.length : "X"}/${MAX}\n${squares}`;
    $("end").hidden = false;
    if (mode === "daily" && !restore) recordStats();
    showStats();
  }

  function recordStats() {
    const s = store.get("sf-stats", { played: 0, wins: 0, streak: 0, last: "", dist: [0, 0, 0, 0, 0, 0] });
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yest = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    s.played++;
    if (won) { s.wins++; s.dist[guesses.length - 1]++; s.streak = s.last === yest || s.streak === 0 ? s.streak + 1 : 1; } else s.streak = 0;
    s.last = today();
    store.set("sf-stats", s);
  }

  function showStats() {
    const s = store.get("sf-stats", { played: 0, wins: 0, streak: 0 });
    $("streak").textContent = s.streak;
    $("stats").textContent = `Played ${s.played} · Won ${s.played ? Math.round(100 * s.wins / s.played) : 0}% · Streak ${s.streak}`;
  }

  // Autocomplete
  let matches = [], sel = -1;
  function options() {
    const q = $("guess").value.trim().toLowerCase();
    matches = q ? CODES.filter(c => STATES[c].toLowerCase().includes(q) && !guesses.includes(c)) : [];
    matches.sort((a, b) => STATES[a].toLowerCase().startsWith(q) === STATES[b].toLowerCase().startsWith(q) ? 0 : STATES[a].toLowerCase().startsWith(q) ? -1 : 1);
    sel = matches.length ? 0 : -1;
    const ul = $("options"); ul.innerHTML = "";
    matches.forEach((c, i) => { const li = document.createElement("li"); li.textContent = STATES[c]; li.setAttribute("role", "option"); if (i === sel) li.className = "on"; li.onmousedown = e => { e.preventDefault(); submit(c); }; ul.append(li); });
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
    const exact = CODES.find(c => STATES[c].toLowerCase() === q);
    submit(exact || (sel >= 0 ? matches[sel] : null));
  });
  $("copy").onclick = async () => { try { await navigator.clipboard.writeText($("share-text").textContent); $("copy").textContent = "Copied!"; } catch { $("copy").textContent = "Copy failed"; } setTimeout(() => $("copy").textContent = "Copy result", 1500); };
  $("practice").onclick = () => setup("practice");
  $("mode-btn").onclick = () => setup(mode === "daily" ? "practice" : "daily");

  showStats();
  setup("daily");
})();
