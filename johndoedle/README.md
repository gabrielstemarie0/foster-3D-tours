# John Doedle

A daily 7-question game where the **most common** answer scores the most (100 pts, max 700).
Plain HTML/JS front end + two Cloudflare Pages Functions backed by D1. No build step.

```
index.html, styles.css, game.js   the game
questions.json                    the question bank (35 starter questions)
lib/text.js                       answer normalising + typo logic, shared by browser and API
functions/api/stats.js            GET  /api/stats?q=q01,q02   live answer counts
functions/api/submit.js           POST /api/submit            records a finished game
schema.sql, wrangler.toml         D1 tables and bindings
```

## Deploy (Cloudflare + GitHub)
1. Move this folder into its own GitHub repo (it should be the repo root).
2. Create the database and tables:
   ```
   npx wrangler d1 create johndoedle          # copy the database_id into wrangler.toml
   npx wrangler d1 execute johndoedle --remote --file=schema.sql
   ```
3. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the GitHub repo.
   Framework preset: None, build command: empty, output directory: `/`.
4. Pages project → Settings → Bindings → add a **D1 database** binding named `DB` → `johndoedle`.
5. Optional: add a custom domain.

Without the D1 binding the game still works, using only the seed answers.

## How scoring works
- Each question has seed answers in `questions.json`: `["answer", weight, ["alias", ...]]`.
- Finished games send each player's answers to D1, one submission per player per day.
- An answer's popularity is a blend of seed share and live share. Weight on live data is `n / (n + 100)`,
  where `n` is the number of live answers to that question. A live-only answer must have been given by
  at least 3 players (`MIN_LIVE` in `game.js`) before it counts as known.
- Each answer is compared with the question's most popular answer and lands in one of five levels:

  | Level | Points | Rule (share / top share) |
  |---|---|---|
  | John Doe | +100 | 70% or more |
  | Regular Joe | +75 | 40% to under 70% |
  | Neighbor | +50 | over 20% to under 40% |
  | Stranger | +25 | known, but 20% or less |
  | Alien | -100 | nobody else says it |

  Nothing entered (timeout) scores 0. A perfect run is 700; the worst is -700.
- When you add questions, give each seed list at least one answer in each of the first four levels
  (every current question does) so players can reach every score.
- Typos are forgiven: 1 edit for words of 4-7 letters, 2 for 8+, none for 3 or fewer.
- Non-answers (blank, symbols, single or repeated characters) can't be submitted. The field shakes.

## Daily questions
Based on the UTC date. Everyone gets the same 7. The bank is shuffled in cycles, so with 35 questions you
get 5 days with no repeats, then a new shuffle. Add questions to `questions.json` with the next id
(`q36`, ...). Ids must be `q` followed by 2–3 digits. Game #1 is `LAUNCH_DAY` in `game.js`.

## Known limits
- Live counts trust the browser, so a determined person could stuff answers. Fine for a casual game; add
  Turnstile or per-IP limits if it takes off.
- Streaks and progress live in the player's browser (`localStorage`), so they don't follow across devices.
