import { json } from "./_lib.js";
export const onRequestGet = ({ env }) => (env.MUSIXMATCH_KEY ? json({ ok: true }) : json({ error: "not_configured" }, 503));
