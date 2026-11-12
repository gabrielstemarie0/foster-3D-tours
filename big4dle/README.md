# Big4dle

Flagle-style game for the big four sports leagues (NFL, MLB, NBA, NHL). 6 guesses, 6 squares; every wrong guess uncovers one more square of a mystery flag.

- Static, no build step. Serve this folder.
- The flag is the national flag of the team's captain (official captain where the league has one, otherwise the franchise star; see `captains.js`), repainted in the team's colors (`flag.js`). Real flag layouts are kept (stripes, crosses, stars, maple leaf, ...). No logos, names or numbers. Team colors and divisions are in `teams.js`. Captain data is from memory and approximate.
- Two editions: Current Teams (default) and All-Time (adds teams that no longer exist).
- The daily team and reveal order are seeded from the local date. The sport is revealed after guess 3 and the division after guess 5.
- Stats and today's progress live in `localStorage`.
