# Jerseyle

Flagle-style game for the big four sports leagues. 6 guesses, 6 squares; every wrong guess uncovers one more square of a mystery jersey.

- Static, no build step. Serve this folder.
- Jerseys are drawn as SVG from each team's colors (`jersey.js`), not official images. Team data is in `teams.js` (NFL, MLB, NBA, NHL).
- The daily team, jersey number and reveal order are seeded from the local date. Sport is shown up front and guesses are limited to that league.
- Stats and today's progress live in `localStorage`.
