-- Run once:  npx wrangler d1 execute johndoedle --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS answers (
  qid    TEXT NOT NULL,
  answer TEXT NOT NULL,
  count  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (qid, answer)
);
-- One row per player per day, so refreshing/resubmitting can't double count.
CREATE TABLE IF NOT EXISTS submissions (
  day    TEXT NOT NULL,
  player TEXT NOT NULL,
  PRIMARY KEY (day, player)
);
