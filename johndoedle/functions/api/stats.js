// GET /api/stats?q=q01,q02,...  ->  { q01: { total, answers: { "pepperoni": 12, ... } }, ... }
const QID = /^q\d{2,3}$/;

export async function onRequestGet({ request, env }) {
  const ids = (new URL(request.url).searchParams.get("q") || "")
    .split(",")
    .filter((id) => QID.test(id))
    .slice(0, 7);
  if (!ids.length || !env.DB) return json({});

  const marks = ids.map(() => "?").join(",");
  const statements = [
    env.DB.prepare(`SELECT qid, SUM(count) AS total FROM answers WHERE qid IN (${marks}) GROUP BY qid`).bind(...ids),
    ...ids.map((id) =>
      env.DB.prepare("SELECT answer, count FROM answers WHERE qid = ? ORDER BY count DESC LIMIT 80").bind(id)
    ),
  ];
  const [totals, ...tops] = await env.DB.batch(statements);

  const out = {};
  ids.forEach((id, i) => {
    out[id] = { total: 0, answers: {} };
    for (const r of tops[i].results) out[id].answers[r.answer] = r.count;
  });
  for (const r of totals.results) out[r.qid].total = r.total;
  return json(out, { "cache-control": "public, max-age=30" });
}

function json(body, headers = {}) {
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json", ...headers } });
}
