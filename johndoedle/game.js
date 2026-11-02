import { normalize, distance, allowedTypos, isValidAnswer } from "./lib/text.js";

// ---------- settings ----------
const LAUNCH_DAY = "2026-11-02"; // game #1
const SECONDS = 25;
const PER_DAY = 7;
const LIVE_HALF = 100; // after ~100 live answers on a question, seed data and live data count equally
const STORE_KEY = "jd:v1";
const MIN_LIVE = 3; // a player-submitted answer only counts as "known" once 3 people have given it

// ---------- levels ----------
// Judged against the most popular answer to the question (share / top share).
const LEVELS = [
  { id: "johndoe", name: "John Doe", pts: 100, emoji: "🟩", note: "the most popular answers" },
  { id: "joe", name: "Regular Joe", pts: 75, emoji: "🟨", note: "a common answer" },
  { id: "neighbor", name: "Neighbor", pts: 50, emoji: "🟧", note: "a less common answer" },
  { id: "stranger", name: "Stranger", pts: 25, emoji: "🟥", note: "a rare answer" },
  { id: "alien", name: "Alien", pts: -100, emoji: "👽", note: "nobody else says it" },
];
const NOTHING = { id: "nothing", name: "Nothing", pts: 0, emoji: "⬛", note: "no answer" };
const levelByPts = (p) => [...LEVELS, NOTHING].find((l) => l.pts === p) || NOTHING;
function levelFor(ratio) {
  if (ratio >= 0.7) return LEVELS[0];
  if (ratio >= 0.4) return LEVELS[1];
  if (ratio > 0.2) return LEVELS[2];
  if (ratio > 0) return LEVELS[3];
  return LEVELS[4];
}

const $ = (id) => document.getElementById(id);
const views = { intro: $("intro"), play: $("play"), results: $("results") };

// ---------- date + question selection ----------
function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}
function dayIndex(day) {
  return Math.max(0, Math.round((Date.parse(day + "T00:00:00Z") - Date.parse(LAUNCH_DAY + "T00:00:00Z")) / 86400000));
}
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Everyone gets the same 7 for a given date. Each "cycle" walks through the whole
// bank in a fresh shuffled order, so questions don't repeat until the bank is used up.
function pickQuestions(bank, day) {
  const idx = dayIndex(day);
  const daysPerCycle = Math.max(1, Math.floor(bank.length / PER_DAY));
  const cycle = Math.floor(idx / daysPerCycle);
  const pos = idx % daysPerCycle;
  const rand = mulberry32(cycle + 1);
  const order = bank.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.slice(pos * PER_DAY, pos * PER_DAY + PER_DAY).map((i) => bank[i]);
}

// ---------- saved state ----------
function uid() {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && s.player) return s;
  } catch {}
  return { player: uid(), days: {}, streak: { count: 0, best: 0, last: null } };
}
let state = loadState();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
}

// ---------- scoring ----------
function buildModel(q, live) {
  const seed = new Map(); // key -> { label, count }
  const alias = new Map(); // any accepted spelling -> canonical key
  for (const [label, count, aliases = []] of q.answers) {
    const k = normalize(label);
    seed.set(k, { label, count });
    alias.set(k, k);
    for (const a of aliases) alias.set(normalize(a), k);
  }
  const liveAnswers = {};
  for (const [k, n] of Object.entries((live && live.answers) || {})) if (n >= MIN_LIVE) liveAnswers[k] = n;
  const liveTotal = (live && live.total) || 0;
  const seedTotal = [...seed.values()].reduce((n, v) => n + v.count, 0) || 1;
  const lambda = liveTotal / (liveTotal + LIVE_HALF);

  const share = new Map();
  for (const k of new Set([...seed.keys(), ...Object.keys(liveAnswers)])) {
    const s = (seed.get(k)?.count || 0) / seedTotal;
    const l = liveTotal ? (liveAnswers[k] || 0) / liveTotal : 0;
    share.set(k, (1 - lambda) * s + lambda * l);
  }
  const top = Math.max(...share.values(), 1e-9);
  const levelOf = (k) => levelFor((share.get(k) || 0) / top);
  const label = (k) => seed.get(k)?.label || k;
  const ranked = [...share.keys()].sort((a, b) => share.get(b) - share.get(a));

  // Typo tolerance: exact/alias match first, then the closest known answer within a few edits.
  function resolve(raw) {
    const k = normalize(raw);
    if (!k) return null;
    if (alias.has(k)) return alias.get(k);
    if (k in liveAnswers) return k;
    const limit = allowedTypos(k.length);
    let best = null, bestD = limit + 1, bestShare = -1;
    for (const c of [...alias.keys(), ...Object.keys(liveAnswers)]) {
      const canon = alias.get(c) ?? c;
      const d = distance(k, c);
      const sh = share.get(canon) || 0;
      if (d < bestD || (d === bestD && sh > bestShare)) { best = canon; bestD = d; bestShare = sh; }
    }
    return best !== null && bestD <= limit ? best : k;
  }

  return {
    score(raw) {
      const key = resolve(raw);
      if (!key) return { key: "", label: "", pts: NOTHING.pts };
      return { key, label: label(key), pts: levelOf(key).pts };
    },
    topAnswers: (n) => ranked.slice(0, n).map(label),
  };
}

// ---------- boot ----------
const bank = await fetch("questions.json").then((r) => r.json());
const day = todayUTC();
const gameNo = dayIndex(day) + 1;
const questions = pickQuestions(bank, day);
const today = (state.days[day] ||= { answers: [], startedAt: null, submitted: false });
let stats = {};
let models = [];

async function loadStats() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const res = await fetch("/api/stats?q=" + questions.map((q) => q.id).join(","), { signal: ctl.signal });
    clearTimeout(t);
    if (res.ok) stats = await res.json();
  } catch {} // offline or no backend yet: fall back to the seed answers
  models = questions.map((q) => buildModel(q, stats[q.id]));
}

function show(name) {
  for (const [k, el] of Object.entries(views)) el.hidden = k !== name;
}
function updateStreak() {
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const { count, last } = state.streak;
  $("streak").textContent = last === day || last === yesterday ? count : 0;
}

// ---------- playing ----------
let tick = null;
let cur = 0;
let running = 0;

function showQuestion() {
  cur = today.answers.length;
  if (cur >= PER_DAY) return finish();
  show("play");
  $("feedback").hidden = true;
  $("answer-form").hidden = false;
  $("answer").value = "";
  $("answer").disabled = false;
  $("answer").removeAttribute("aria-invalid");
  $("answer-hint").hidden = true;
  $("qnum").textContent = `Question ${cur + 1} of ${PER_DAY}`;
  $("running").textContent = `${running} pts`;
  $("prompt").textContent = questions[cur].prompt;
  if (!today.startedAt) { today.startedAt = Date.now(); save(); }
  $("answer").focus();
  clearInterval(tick);
  tick = setInterval(frame, 100);
  frame();
}

function frame() {
  const left = SECONDS * 1000 - (Date.now() - today.startedAt);
  const secs = Math.max(0, Math.ceil(left / 1000));
  $("timer-text").textContent = secs;
  const bar = $("timer-bar");
  bar.style.transform = `scaleX(${Math.max(0, left) / (SECONDS * 1000)})`;
  bar.classList.toggle("low", secs <= 10 && secs > 5);
  bar.classList.toggle("critical", secs <= 5);
  if (left <= 0) lockIn(true);
}

// Manual submit: non-answers are rejected (shake) and the timer keeps running.
function trySubmit() {
  if (isValidAnswer($("answer").value)) return lockIn(false);
  const input = $("answer");
  $("answer-hint").hidden = false;
  input.setAttribute("aria-invalid", "true");
  input.classList.remove("shake");
  void input.offsetWidth; // restart the animation
  input.classList.add("shake");
  input.focus();
}

function lockIn(timedOut) {
  clearInterval(tick);
  const typed = $("answer").value.trim();
  const raw = isValidAnswer(typed) ? typed : ""; // on timeout, a non-answer counts as blank
  const r = models[cur].score(raw);
  today.answers.push({ raw, key: r.key, label: r.label, pts: r.pts });
  today.startedAt = null;
  running += r.pts;
  save();

  $("answer").disabled = true;
  $("answer-form").hidden = true;
  $("running").textContent = `${running} pts`;
  const lvl = levelByPts(r.pts);
  $("fb-pts").textContent = r.pts > 0 ? `+${r.pts}` : r.pts < 0 ? `\u2212${-r.pts}` : "0";
  $("fb-pts").className = `pts lvl-${lvl.id}`;
  $("fb-level").textContent = `${lvl.emoji} ${lvl.name}`;
  $("fb-text").textContent = !raw
    ? "Time's up, nothing entered."
    : r.pts === 100 ? `"${r.label}" is one of the most popular answers!`
    : r.pts === -100 ? `"${raw}": nobody else says that. Ouch.`
    : `"${r.label}" is ${lvl.note}.`;
  $("next").textContent = today.answers.length >= PER_DAY ? "See results" : "Next question";
  $("feedback").hidden = false;
  $("next").focus();
}

function finish() {
  clearInterval(tick);
  if (!today.done) {
    today.done = true;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const s = state.streak;
    if (s.last !== day) {
      s.count = s.last === yesterday ? s.count + 1 : 1;
      s.best = Math.max(s.best, s.count);
      s.last = day;
    }
    save();
  }
  updateStreak();
  submitOnce();
  renderResults();
}

async function submitOnce() {
  if (today.submitted) return;
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        player: state.player,
        day,
        answers: today.answers.map((a, i) => ({ q: questions[i].id, a: a.key })).filter((a) => a.a),
      }),
    });
    if (res.ok) { today.submitted = true; save(); }
  } catch {} // will retry next visit
}

// ---------- results ----------
const EMOJI = (p) => levelByPts(p).emoji;

function renderResults() {
  show("results");
  const total = today.answers.reduce((n, a) => n + a.pts, 0);
  $("res-day").textContent = `John Doedle #${gameNo}`;
  $("total").textContent = total;
  $("verdict").textContent =
    total >= 650 ? "Peak John Doe. Perfectly ordinary."
    : total >= 500 ? "Very relatable. You'd blend into any crowd."
    : total >= 300 ? "Pretty average, which is the goal."
    : total >= 100 ? "A bit quirky. Maybe too quirky."
    : total >= 0 ? "You march to your own drum."
    : "Alien detected. Please blend in.";
  const list = $("breakdown");
  list.replaceChildren();
  today.answers.forEach((a, i) => {
    const li = document.createElement("li");
    const top = document.createElement("div");
    top.className = "row-top";
    const q = document.createElement("span");
    q.className = "row-q";
    q.textContent = questions[i].prompt;
    const p = document.createElement("span");
    p.textContent = `${EMOJI(a.pts)} ${levelByPts(a.pts).name} ${a.pts > 0 ? "+" : a.pts < 0 ? "\u2212" : ""}${Math.abs(a.pts)}`;
    p.className = `row-pts lvl-${levelByPts(a.pts).id}`;
    top.append(q, p);
    const you = document.createElement("div");
    you.className = "row-you";
    you.textContent = a.raw ? `You said: ${a.raw}` : "No answer";
    const best = document.createElement("div");
    best.className = "row-top3";
    best.textContent = `Top answers: ${models[i].topAnswers(3).join(", ")}`;
    li.append(top, you, best);
    list.append(li);
  });
}

function shareText() {
  const total = today.answers.reduce((n, a) => n + a.pts, 0);
  return `John Doedle #${gameNo} ${total}/700\n${today.answers.map((a) => EMOJI(a.pts)).join("")}\n${location.origin}${location.pathname}`;
}

async function copyShare() {
  const text = shareText();
  try {
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      await navigator.share({ text });
      return;
    }
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.append(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    ta.remove();
  }
  $("copied").hidden = false;
  setTimeout(() => ($("copied").hidden = true), 2000);
}

function countdown() {
  const now = new Date();
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const left = Math.max(0, Math.floor((next - now) / 1000));
  if (left === 0) return location.reload();
  const p = (n) => String(n).padStart(2, "0");
  $("countdown").textContent = `${p(Math.floor(left / 3600))}:${p(Math.floor((left % 3600) / 60))}:${p(left % 60)}`;
}

// ---------- wire up ----------
$("answer-form").addEventListener("submit", (e) => { e.preventDefault(); trySubmit(); });
$("answer").addEventListener("input", () => {
  $("answer-hint").hidden = true;
  $("answer").removeAttribute("aria-invalid");
});
$("next").addEventListener("click", showQuestion);
$("start").addEventListener("click", async () => {
  $("start").disabled = true;
  await loadStats();
  showQuestion();
});
$("share").addEventListener("click", copyShare);

updateStreak();
$("intro-day").textContent = `Game #${gameNo} · ${new Date(day + "T00:00:00Z").toLocaleDateString(undefined, { month: "long", day: "numeric", timeZone: "UTC" })}`;
setInterval(countdown, 1000);
countdown();

if (today.done || today.answers.length >= PER_DAY) {
  await loadStats();
  running = today.answers.reduce((n, a) => n + a.pts, 0);
  finish();
} else if (today.answers.length > 0 || today.startedAt) {
  await loadStats();
  running = today.answers.reduce((n, a) => n + a.pts, 0);
  showQuestion();
} else {
  show("intro");
}
