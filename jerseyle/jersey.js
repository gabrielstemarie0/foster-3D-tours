// Draws a jersey as SVG from team colors. Not an official image: a color-accurate recreation.
function lum(hex) { const n = parseInt(hex.slice(1), 16); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(n >> 16) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); }
function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function inkOn(bg, prefs) { for (const p of prefs) if (contrast(bg, p) >= 3) return p; return lum(bg) > .4 ? "#111" : "#fff"; }

const SHAPES = {
  football:   "M92 12L122 6Q150 24 178 6L208 12L252 52L224 92L204 78V196H96V78L76 92L48 52Z",
  baseball:   "M96 10L124 4Q150 22 176 4L204 10L250 56L224 94L204 80V196H96V80L76 94L50 56Z",
  basketball: "M104 6L128 6Q150 58 172 6L196 6L204 62L218 196H82L96 62Z",
  hockey:     "M92 12L122 6Q150 24 178 6L208 12L270 128L238 146L204 92V196H96V92L62 146L30 128Z"
};

function jerseySVG(sport, t, num) {
  const { c1, c2, c3 } = t;
  const id = "j" + Math.random().toString(36).slice(2, 7);
  const ink = inkOn(c1, [c2, c3, "#fff", "#111"]);
  const edge = inkOn(c1, [c3, c2]) === ink ? (lum(ink) > .4 ? "#111" : "#fff") : inkOn(c1, [c3, c2]);
  const body = SHAPES[sport];
  let deco = "";
  const L = (x1, y1, x2, y2, w, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"/>`;
  if (t.pin) for (let x = 100; x < 210; x += 9) deco += L(x, 0, x, 200, 1.6, c2);
  if (sport === "football") {
    for (const [dx, dy, c] of [[16, -10, c2], [27, -17, c3]]) { deco += L(60 + dx, 62 + dy, 84 + dx, 90 + dy, 5, c) + L(240 - dx, 62 + dy, 216 - dx, 90 + dy, 5, c); }
    deco += `<path d="M122 6Q150 24 178 6L168 6Q150 36 132 6Z" fill="${c2}"/>`;
  } else if (sport === "baseball") {
    deco += L(150, 24, 150, 196, 6, c2) + L(147, 24, 147, 196, 1.5, c3);
    for (let y = 50; y < 190; y += 28) deco += `<circle cx="150" cy="${y}" r="3" fill="${c3}"/>`;
    deco += `<path d="M124 4Q150 22 176 4L168 4Q150 32 132 4Z" fill="${c2}"/>`;
    deco += L(54, 66, 78, 94, 7, c2) + L(246, 66, 222, 94, 7, c2);
  } else if (sport === "basketball") {
    deco += `<path d="M104 6L128 6Q150 58 172 6L196 6" fill="none" stroke="${c2}" stroke-width="7"/>`;
    deco += `<path d="M96 62L82 196M204 62L218 196" fill="none" stroke="${c2}" stroke-width="9"/>`;
    deco += `<path d="M83 188H217" stroke="${c3}" stroke-width="5"/>`;
  } else {
    for (const [d, c, w] of [[0, c2, 8], [13, c3, 4], [24, c2, 8]]) {
      deco += L(40 + d * .3, 118 - d * .46 + 18, 66 + d * .3, 134 - d * .46 + 18, w, c);
      deco += L(260 - d * .3, 118 - d * .46 + 18, 234 - d * .3, 134 - d * .46 + 18, w, c);
    }
    deco += `<rect x="90" y="166" width="120" height="8" fill="${c2}"/><rect x="90" y="178" width="120" height="4" fill="${c3}"/>`;
    deco += `<path d="M122 6Q150 24 178 6L168 6Q150 36 132 6Z" fill="${c2}"/>`;
  }
  const size = Math.min(26, 220 / t.nick.length);
  const ty = sport === "basketball" ? 96 : 100;
  const text = `<text x="150" y="${ty}" text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-weight="900" font-size="${size}" letter-spacing=".5" fill="${ink}" stroke="${edge}" stroke-width=".6">${t.nick.toUpperCase()}</text>` +
    `<text x="150" y="${ty + 50}" text-anchor="middle" font-family="Impact,'Arial Black',sans-serif" font-weight="900" font-size="54" fill="${ink}" stroke="${edge}" stroke-width="2" paint-order="stroke">${num}</text>`;
  const bgc = lum(c1) > .5 ? "#cfd3dc" : "#e7e9ee";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" role="img" aria-label="${t.name} jersey">` +
    `<rect width="300" height="200" fill="${bgc}"/><defs><clipPath id="${id}"><path d="${body}"/></clipPath></defs>` +
    `<path d="${body}" fill="${c1}"/><g clip-path="url(#${id})">${deco}</g>` +
    `<path d="${body}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2" stroke-linejoin="round"/>${text}</svg>`;
}
