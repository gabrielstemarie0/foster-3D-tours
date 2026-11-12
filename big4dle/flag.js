// Draws a team's colors as a waving flag on a pole. Only colors: no logos, names or numbers.
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function lum(hex) { const n = parseInt(hex.slice(1), 16); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(n >> 16) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); }

// Flag-space (u, v in 0..1) -> picture space. The wave grows from the pole (u = 0) to the free end.
const FX = 44, FY = 30, FW = 226, FH = 128, AMP = 11;
const wave = u => AMP * u * Math.sin(u * Math.PI * 2.6 + .4);
const map = (u, v) => [FX + u * FW, FY + v * FH + wave(u)];

// Polygon in flag-space with edges subdivided so straight edges follow the ripples.
function poly(pts, fill) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const [a, b] = [pts[i], pts[(i + 1) % pts.length]];
    for (let s = 0; s < 28; s++) { const t = s / 28; out.push(map(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t).map(n => n.toFixed(1)).join(",")); }
  }
  return `<polygon points="${out.join(" ")}" fill="${fill}" stroke="${fill}" stroke-width=".6" stroke-linejoin="round"/>`;
}
const box = (u0, v0, u1, v1, fill) => poly([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], fill);

function flagSVG(t) {
  const { c1, c2, c3 } = t;
  const id = "f" + Math.random().toString(36).slice(2, 7);
  const v = hashStr(t.name) % 4;
  let art = box(0, 0, 1, 1, c1);
  if (v === 0) art = box(0, 0, 1, .5, c1) + box(0, .5, 1, .8, c2) + box(0, .8, 1, 1, c3);                    // horizontal bands
  if (v === 1) art = box(0, 0, .5, 1, c1) + box(.5, 0, .8, 1, c2) + box(.8, 0, 1, 1, c3);                    // vertical bands
  if (v === 2) art = poly([[0, 0], [1, 0], [0, 1]], c1) + poly([[1, 0], [1, 1], [0, 1]], c2) +                // diagonal split with a stripe
    poly([[.88, 0], [1, 0], [1, .12], [.12, 1], [0, 1], [0, .88]], c3);
  if (v === 3) art = box(0, 0, 1, 1, c1) + box(0, .36, 1, .64, c2) + box(.22, 0, .42, 1, c2) +               // Nordic cross
    box(0, .45, 1, .55, c3) + box(.28, 0, .36, 1, c3);

  // cloth outline (clip) and ripple shading
  const top = [], bot = [];
  for (let i = 0; i <= 60; i++) { const u = i / 60; top.push(map(u, 0)); bot.push(map(u, 1)); }
  const outline = top.concat(bot.reverse()).map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
  let darkStops = "", lightStops = "";
  for (let i = 0; i <= 80; i++) {
    const u = i / 80, s = Math.cos(u * Math.PI * 2.6 + .4);   // slope of the wave
    darkStops += `<stop offset="${u.toFixed(4)}" stop-color="#000" stop-opacity="${(Math.max(s, 0) * .2).toFixed(3)}"/>`;
    lightStops += `<stop offset="${u.toFixed(4)}" stop-color="#fff" stop-opacity="${(Math.max(-s, 0) * .2).toFixed(3)}"/>`;
  }
  const ripple = `<rect x="${FX}" y="0" width="${FW}" height="200" fill="url(#${id}rd)"/><rect x="${FX}" y="0" width="${FW}" height="200" fill="url(#${id}rl)"/>`;
  const pole = `<rect x="34" y="12" width="7" height="186" rx="3" fill="url(#${id}p)"/><circle cx="37.5" cy="11" r="6" fill="url(#${id}g)"/>`;
  const light = [c1, c2, c3].filter(c => lum(c) > .5).length >= 2;
  const bg = light ? ["#b9bfcc", "#8f97a8"] : ["#eef0f5", "#d2d6e0"];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" role="img" aria-label="Mystery flag of team colors">` +
    `<defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
      <linearGradient id="${id}p" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d7380"/><stop offset=".45" stop-color="#e3e6ec"/><stop offset="1" stop-color="#7a808d"/></linearGradient>
      <radialGradient id="${id}g" cx=".35" cy=".3"><stop offset="0" stop-color="#fff2b8"/><stop offset="1" stop-color="#b8902f"/></radialGradient>
      <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${id}rd" x1="0" y1="0" x2="1" y2="0">${darkStops}</linearGradient>
      <linearGradient id="${id}rl" x1="0" y1="0" x2="1" y2="0">${lightStops}</linearGradient>
      <filter id="${id}d" x="-15%" y="-15%" width="130%" height="140%"><feDropShadow dx="3" dy="6" stdDeviation="4" flood-color="#000" flood-opacity=".3"/></filter>
      <clipPath id="${id}c"><polygon points="${outline}"/></clipPath>
    </defs>` +
    `<rect width="300" height="200" fill="url(#${id}bg)"/>` +
    pole +
    `<g filter="url(#${id}d)"><polygon points="${outline}" fill="${c1}"/></g>` +
    `<g clip-path="url(#${id}c)">${art}${ripple}<rect width="300" height="200" fill="url(#${id}v)"/></g>` +
    `<polygon points="${outline}" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1" stroke-linejoin="round"/>` +
    `<rect x="34" y="${FY - 2}" width="7" height="5" fill="rgba(0,0,0,.2)"/><rect x="34" y="${FY + FH - 3}" width="7" height="5" fill="rgba(0,0,0,.2)"/>` +
    `</svg>`;
}
