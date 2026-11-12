# Big4dle

Flagle-style game for the big four sports leagues (NFL, MLB, NBA, NHL). 6 guesses, 6 squares; every wrong guess uncovers one more square of a mystery flag made only of a team's colors.

- Static, no build step. Serve this folder.
- Flags are drawn as SVG from each team's colors (`flag.js`): bands, a diagonal, or a Nordic-style cross. No logos, names or numbers. Team colors and divisions are in `teams.js`.
- Two editions: Current Teams (default) and All-Time (adds teams that no longer exist).
- The daily team and reveal order are seeded from the local date. The sport is revealed after guess 3 and the division after guess 5.
- Stats and today's progress live in `localStorage`.
