(() => {
  const C = window.CELEBS, POOL = window.POOL;
  const $ = (id) => document.getElementById(id);
  const input = $("guess"), list = $("options"), grid = $("grid"), statusEl = $("status");
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");

  // ----- state -----
  const dayKey = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const hash = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  let mode = "daily", answer, guesses = [], done = false;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  function dailyAnswer() { return C[POOL[hash("ballroomdle-" + dayKey()) % POOL.length]]; }

  function start(m) {
    mode = m;
    $("mode-btn").textContent = m === "daily" ? "Daily" : "Practice";
    guesses = []; done = false; $("end").hidden = true; $("again").hidden = m === "daily";
    grid.querySelectorAll(".row:not(.head)").forEach((r) => r.remove());
    statusEl.textContent = "";
    if (m === "daily") {
      answer = dailyAnswer();
      const saved = store.get("bd-daily");
      if (saved && saved.day === dayKey()) saved.names.forEach((n) => addGuess(C.find((c) => c.n === n), false));
    } else {
      answer = C[POOL[Math.floor(Math.random() * POOL.length)]];
    }
  }

  // ----- comparison -----
  function num(g, a, close) {
    const cls = g === a ? "g" : Math.abs(g - a) <= close ? "y" : "n";
    return { cls, text: g + (g < a ? " ▲" : g > a ? " ▼" : "") };
  }
  function compare(g) {
    const shared = g.p.filter((x) => answer.p.includes(x)).length;
    const same = g.p.length === answer.p.length && shared === g.p.length;
    return [
      { cls: g.n === answer.n ? "g" : "n", text: g.n, name: true },
      num(g.s, answer.s, 2),
      { cls: same ? "g" : shared ? "y" : "n", text: g.p.join(" / ") },
      { cls: g.g === answer.g ? "g" : "n", text: g.g },
      num(g.a, answer.a, 5),
      { cls: g.pro === answer.pro ? "g" : "n", text: g.pro },
      num(g.pl, answer.pl, 2),
      { cls: g.sn === answer.sn ? "g" : "n", text: g.sn },
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
    if (g === answer) finish(true);
  }
  function emoji(g) { return compare(g).slice(1).map((c) => ({ g: "🟩", y: "🟨", n: "⬜" })[c.cls]).join(""); }

  function finish(won) {
    done = true; $("end").hidden = false;
    $("end-title").textContent = won ? "You found them!" : "";
    $("end-text").textContent = `${answer.n}: season ${answer.s}, finished ${answer.pl === 1 ? "1st (Mirrorball champion)" : "#" + answer.pl}. Solved in ${guesses.length} guess${guesses.length === 1 ? "" : "es"}.`;
    input.disabled = true;
  }

  // ----- autocomplete -----
  let matches = [], sel = -1;
  function render() {
    const q = norm(input.value.trim());
    const used = new Set(guesses.map((g) => g.n));
    matches = q ? C.filter((c) => !used.has(c.n) && norm(c.n).includes(q))
      .sort((a, b) => (norm(a.n).startsWith(q) ? 0 : 1) - (norm(b.n).startsWith(q) ? 0 : 1) || a.n.localeCompare(b.n)).slice(0, 8) : [];
    list.innerHTML = ""; sel = matches.length ? 0 : -1;
    matches.forEach((m, i) => {
      const li = document.createElement("li"); li.setAttribute("role", "option"); li.setAttribute("aria-selected", i === sel);
      li.innerHTML = `<span></span><small>S${m.s}</small>`; li.firstChild.textContent = m.n;
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
    if (done || !g) { if (!g) statusEl.textContent = "Pick a name from the list."; return; }
    input.value = ""; render(); statusEl.textContent = "";
    addGuess(g);
    if (mode === "daily") store.set("bd-daily", { day: dayKey(), names: guesses.map((x) => x.n) });
  }
  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); highlight(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlight(-1); }
    else if (e.key === "Escape") { list.hidden = true; }
  });
  input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 100));
  $("guess-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = norm(input.value.trim());
    const exact = C.find((c) => norm(c.n) === q && !guesses.includes(c));
    submit(exact || matches[sel]);
  });

  // ----- buttons -----
  $("help-btn").addEventListener("click", () => $("help").showModal());
  $("mode-btn").addEventListener("click", () => { input.disabled = false; start(mode === "daily" ? "practice" : "daily"); });
  $("again").addEventListener("click", () => { input.disabled = false; start("practice"); });
  $("share").addEventListener("click", async () => {
    const text = `Ballroomdle ${mode === "daily" ? dayKey() : "(practice)"} ${guesses.length} guesses\n` + [...guesses].map(emoji).join("\n");
    try { await navigator.clipboard.writeText(text); statusEl.textContent = "Copied!"; } catch { statusEl.textContent = text; }
  });

  start("daily");
  if (!store.get("bd-seen")) { store.set("bd-seen", 1); $("help").showModal(); }
})();
