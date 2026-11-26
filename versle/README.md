# Versle

Daily song-verse guessing game. Most words of a verse are boxed out; every wrong guess or skip reveals another word.

## How verses are sourced
- `catalog.json`: song titles and artists only (the guess list). Append to the end to add songs; do not reorder.
- `/api/verse` (Cloudflare Pages Function): picks the daily song, asks Musixmatch for its lyric, returns **only one verse** plus a signed token. The answer stays server-side until `/api/check` reveals it.
- The API key never reaches the browser.

## Setup
1. Get an API key at developer.musixmatch.com.
2. In Cloudflare Pages: Settings, Variables and Secrets, add a **secret** named `MUSIXMATCH_KEY`. Optionally add `VERSLE_SECRET` (any long random string) for signing tokens.
3. Redeploy. For local testing put `MUSIXMATCH_KEY=...` in `functions/.dev.vars` and run `npx wrangler pages dev .`.

## Notes
- The free Musixmatch tier returns partial lyrics, limits daily calls, and its terms restrict storing and republishing lyric text. This code does not store lyrics. Read Musixmatch's current terms before launching publicly; a commercial agreement may be required.
- Without a key the game falls back to public-domain verses in `data.js` (currently empty).
- Show the attribution Musixmatch's terms require.
