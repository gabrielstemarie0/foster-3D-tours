(() => {
  const C = window.COUNTRIES;
  const $ = (id) => document.getElementById(id);
  const input = $("guess"), list = $("options"), grid = $("grid"), statusEl = $("status");
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
  const dayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const hash = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  let mode = "daily", answer, guesses = [], done = false;

  const rad = (x) => x * Math.PI / 180;
  function dist(a, b) {
    const dLa = rad(b.la - a.la), dLo = rad(b.lo - a.lo);
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.la)) * Math.cos(rad(b.la)) * Math.sin(dLo / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }
  function bearing(a, b) {
    const y = Math.sin(rad(b.lo - a.lo)) * Math.cos(rad(b.la));
    const x = Math.cos(rad(a.la)) * Math.sin(rad(b.la)) - Math.sin(rad(a.la)) * Math.cos(rad(b.la)) * Math.cos(rad(b.lo - a.lo));
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
  const ARROWS = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"];
  const fmt = (v) => v >= 100 ? Math.round(v).toLocaleString() : v >= 10 ? v.toFixed(0) : v.toFixed(1);
  function ratio(g, a, unit) {
    const r = g / a;
    return { cls: g === a ? "g" : r > 0.75 && r < 1.25 ? "y" : "n", text: fmt(g) + unit + (g < a ? " ▲" : g > a ? " ▼" : "") };
  }
  function compare(g) {
    const km = dist(g, answer), same = g === answer;
    return [
      { cls: same ? "g" : "n", text: g.n, name: true },
      { cls: g.c === answer.c ? "g" : "n", text: g.c },
      ratio(g.p, answer.p, "M"),
      ratio(g.a, answer.a, "k km²"),
      { cls: g.l === answer.l ? "g" : "n", text: g.l ? "Landlocked" : "Coastal" },
      { cls: same ? "g" : "n", text: same ? "🎯" : ARROWS[Math.round(bearing(g, answer) / 45) % 8] },
      { cls: same ? "g" : km < 2000 ? "y" : "n", text: same ? "0 km" : Math.round(km).toLocaleString() + " km" },
    ];
  }
  function addGuess(g, animate = true) {
    guesses.push(g);
    const row = document.createElement("div"); row.className = "row";
    compare(g).forEach((c, i) => {
      const d = document.createElement("div");
      d.className = c.cls + (c.name ? " name" : "") + (animate ? " flip" : "");
      d.style.setProperty("--i", i); d.textContent = c.text; row.appendChild(d);
    });
    grid.querySelector(".head").after(row);
    if (g === answer) finish();
  }
  const emoji = (g) => compare(g).slice(1).map((c) => ({ g: "🟩", y: "🟨", n: "⬜" })[c.cls]).join("");
  function finish() {
    done = true; $("end").hidden = false; input.disabled = true;
    $("end-title").textContent = "You found it!";
    $("end-text").textContent = `${answer.n} in ${guesses.length} guess${guesses.length === 1 ? "" : "es"}.`;
  }
  function start(m) {
    mode = m; $("mode-btn").textContent = m === "daily" ? "Daily" : "Practice";
    guesses = []; done = false; $("end").hidden = true; $("again").hidden = m === "daily";
    grid.querySelectorAll(".row:not(.head)").forEach((r) => r.remove());
    statusEl.textContent = "";
    if (m === "daily") {
      answer = C[hash("countrydle-" + dayKey()) % C.length];
      const saved = store.get("cd-daily");
      if (saved && saved.day === dayKey()) saved.names.forEach((n) => addGuess(C.find((c) => c.n === n), false));
    } else answer = C[Math.floor(Math.random() * C.length)];
  }

  let matches = [], sel = -1;
  function render() {
    const q = norm(input.value.trim()), used = new Set(guesses.map((g) => g.n));
    matches = q ? C.filter((c) => !used.has(c.n) && norm(c.n).includes(q))
      .sort((a, b) => (norm(a.n).startsWith(q) ? 0 : 1) - (norm(b.n).startsWith(q) ? 0 : 1) || a.n.localeCompare(b.n)).slice(0, 8) : [];
    list.innerHTML = ""; sel = matches.length ? 0 : -1;
    matches.forEach((m, i) => {
      const li = document.createElement("li"); li.setAttribute("role", "option"); li.setAttribute("aria-selected", i === sel);
      li.innerHTML = "<span></span><small></small>"; li.firstChild.textContent = m.n; li.lastChild.textContent = m.c;
      li.addEventListener("mousedown", (e) => { e.preventDefault(); submit(m); });
      list.appendChild(li);
    });
    list.hidden = !matches.length; input.setAttribute("aria-expanded", !list.hidden);
  }
  function highlight(d) {
    if (!matches.length) return; sel = (sel + d + matches.length) % matches.length;
    [...list.children].forEach((li, i) => li.setAttribute("aria-selected", i === sel));
  }
  function submit(g) {
    if (done || !g) { if (!g) statusEl.textContent = "Pick a country from the list."; return; }
    input.value = ""; render(); statusEl.textContent = "";
    addGuess(g);
    if (mode === "daily") store.set("cd-daily", { day: dayKey(), names: guesses.map((x) => x.n) });
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
    submit(C.find((c) => norm(c.n) === q && !guesses.includes(c)) || matches[sel]);
  });
  $("help-btn").addEventListener("click", () => $("help").showModal());
  $("mode-btn").addEventListener("click", () => { input.disabled = false; start(mode === "daily" ? "practice" : "daily"); });
  $("again").addEventListener("click", () => { input.disabled = false; start("practice"); });
  $("share").addEventListener("click", async () => {
    const text = `Countrydle ${mode === "daily" ? dayKey() : "(practice)"} ${guesses.length} guesses\n` + guesses.map(emoji).join("\n");
    try { await navigator.clipboard.writeText(text); statusEl.textContent = "Copied!"; } catch { statusEl.textContent = text; }
  });
  start("daily");
  if (!store.get("cd-seen")) { store.set("cd-seen", 1); $("help").showModal(); }
})();
