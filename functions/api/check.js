import { catalog, json, readToken } from "./_lib.js";

// GET /api/check?token=...&guess=<catalog index>[&reveal=1]
export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const id = await readToken(env, u.searchParams.get("token"));
  if (id === null) return json({ error: "bad_token" }, 400);
  const guess = Number(u.searchParams.get("guess"));
  const correct = guess === id;
  const out = { correct };
  if (correct || u.searchParams.get("reveal") === "1") out.answer = { title: catalog[id][0], artist: catalog[id][1], id };
  return json(out);
}
