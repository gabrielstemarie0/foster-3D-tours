import catalog from "../../versle/catalog.json";

export { catalog };
export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const hash = (s) => {
  let h = 2166136261;
  for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

const secretOf = (env) => env.VERSLE_SECRET || env.MUSIXMATCH_KEY || "";
async function hmac(env, msg) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secretOf(env)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}
// Stateless token: "<songId>.<signature>" so the client never learns the id until the answer is revealed.
export async function makeToken(env, id) { return `${id}.${await hmac(env, "id:" + id)}`; }
export async function readToken(env, token) {
  const [id, sig] = String(token || "").split(".");
  if (!/^\d+$/.test(id || "") || sig !== (await hmac(env, "id:" + id))) return null;
  return Number(id) < catalog.length ? Number(id) : null;
}

// Pick a verse-sized chunk from a lyric body. The free Musixmatch tier returns a partial lyric followed
// by a "*******" footer, so strip everything after it.
export function pickVerse(body, seed, maxWords = 40) {
  const clean = String(body || "").split("*******")[0];
  const chunks = clean.split(/\n\s*\n/)
    .map((c) => c.replace(/\s+/g, " ").trim())
    .filter((c) => c.split(" ").length >= 8);
  if (!chunks.length) return null;
  return chunks[seed % chunks.length].split(" ").slice(0, maxWords).join(" ");
}

export async function fetchLyrics(env, title, artist) {
  const q = new URLSearchParams({ q_track: title, q_artist: artist, apikey: env.MUSIXMATCH_KEY, format: "json" });
  const r = await fetch("https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?" + q);
  if (!r.ok) return null;
  const d = await r.json();
  const l = d?.message?.body?.lyrics;
  return l && !l.instrumental ? l.lyrics_body : null;
}
