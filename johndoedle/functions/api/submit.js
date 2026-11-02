// POST /api/submit  { player, day, answers: [{ q, a }] }
// Counts each player's answers once per day.
import { normalize } from "../../lib/text.js";

const QID = /^q\d{2,3}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export async function onRequestPost({ request, env }) {
  if (!env.DB) return reply({ ok: false, error: "no database" }, 503);
  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "bad json" }, 400);
  }
  const { player, day, answers } = body || {};
  if (typeof player !== "string" || player.length < 8 || player.length > 64) return reply({ ok: false }, 400);
  if (typeof day !== "string" || !DAY.test(day) || !closeToToday(day)) return reply({ ok: false }, 400);
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > 7) return reply({ ok: false }, 400);

  const clean = [];
  const seen = new Set();
  for (const item of answers) {
    if (!item || typeof item.q !== "string" || !QID.test(item.q) || seen.has(item.q)) continue;
    const a = normalize(item.a);
    if (!a) continue;
    seen.add(item.q);
    clean.push([item.q, a]);
  }

  const first = await env.DB.prepare("INSERT OR IGNORE INTO submissions (day, player) VALUES (?, ?)")
    .bind(day, player)
    .run();
  if (!first.meta.changes) return reply({ ok: true, counted: false });

  if (clean.length) {
    await env.DB.batch(
      clean.map(([q, a]) =>
        env.DB.prepare(
          "INSERT INTO answers (qid, answer, count) VALUES (?, ?, 1) ON CONFLICT(qid, answer) DO UPDATE SET count = count + 1"
        ).bind(q, a)
      )
    );
  }
  return reply({ ok: true, counted: true });
}

function closeToToday(day) {
  const diff = Math.abs(Date.parse(day + "T00:00:00Z") - Date.now()) / 86400000;
  return diff < 2;
}

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
