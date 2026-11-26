import { catalog, json, hash, makeToken, pickVerse, fetchLyrics } from "./_lib.js";

// GET /api/verse?mode=daily&day=YYYY-M-D   or   ?mode=practice
// Returns { verse, token }. The song's identity stays on the server until /api/check reveals it.
export async function onRequestGet({ request, env }) {
  if (!env.MUSIXMATCH_KEY) return json({ error: "not_configured" }, 503);
  const u = new URL(request.url);
  const daily = u.searchParams.get("mode") !== "practice";
  let seed;
  if (daily) {
    const day = u.searchParams.get("day") || "";
    const m = day.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!m) return json({ error: "bad_day" }, 400);
    // Only allow today's date (give or take a timezone) so past/future answers can't be scraped.
    const diff = Math.abs(Date.UTC(+m[1], +m[2] - 1, +m[3]) - Date.now()) / 864e5;
    if (diff > 2) return json({ error: "bad_day" }, 400);
    seed = hash("versle-" + day);
  } else seed = Math.floor(Math.random() * 2 ** 31);

  for (let t = 0; t < 6; t++) {
    const id = (seed + t * 7919) % catalog.length;
    const [title, artist] = catalog[id];
    const body = await fetchLyrics(env, title, artist).catch(() => null);
    const verse = pickVerse(body, seed >>> 3);
    if (verse) return json({ verse, token: await makeToken(env, id) });
  }
  return json({ error: "no_lyrics" }, 502);
}
