// Draws the flag of a team's captain's country, repainted in the team's colors, waving on a pole.
// The real flag layout is kept (cross, stripes, stars, maple leaf, ...); the colors are the team's.
function lum(hex) { const n = parseInt(hex.slice(1), 16); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(n >> 16) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); }

// Flag-space (u, v in 0..1) -> picture space. The wave grows from the pole (u = 0) to the free end.
const FX = 44, FY = 30, FW = 226, FH = 128, AMP = 11;
const wave = u => AMP * u * Math.sin(u * Math.PI * 2.6 + .4);
const map = (u, v) => [FX + u * FW, FY + v * FH + wave(u)];
const U = px => px / FW, V = px => px / FH;      // picture pixels -> flag-space

// Polygon in flag-space; edges are subdivided (n) so straight edges follow the ripples.
function poly(pts, fill, n = 28, stroke) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const [a, b] = [pts[i], pts[(i + 1) % pts.length]];
    for (let s = 0; s < n; s++) { const t = s / n; out.push(map(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t).map(x => x.toFixed(1)).join(",")); }
  }
  const st = stroke ? `fill="none" stroke="${stroke[0]}" stroke-width="${stroke[1]}" stroke-linejoin="round"` : `fill="${fill}" stroke="${fill}" stroke-width=".6" stroke-linejoin="round"`;
  return `<polygon points="${out.join(" ")}" ${st}/>`;
}
const box = (u0, v0, u1, v1, fill) => poly([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], fill);
const disc = (cu, cv, R, fill, n = 36) => poly(Array.from({ length: n }, (_, i) => [cu + U(R * Math.cos(2 * Math.PI * i / n)), cv + V(R * Math.sin(2 * Math.PI * i / n))]), fill, 1);
const star = (cu, cv, R, fill, pts = 5, rot = -90) => poly(Array.from({ length: pts * 2 }, (_, i) => { const r = i % 2 ? R * (pts === 5 ? .382 : .45) : R, a = (rot + 180 * i / pts) * Math.PI / 180; return [cu + U(r * Math.cos(a)), cv + V(r * Math.sin(a))]; }), fill, 1);
const hbands = (cols, ratios) => { let v = 0, s = ratios.reduce((a, b) => a + b, 0), o = ""; cols.forEach((c, i) => { const h = ratios[i] / s; o += box(0, v, 1, v + h, c); v += h; }); return o; };
const vbands = (cols, ratios) => { let u = 0, s = ratios.reduce((a, b) => a + b, 0), o = ""; cols.forEach((c, i) => { const w = ratios[i] / s; o += box(u, 0, u + w, 1, c); u += w; }); return o; };
const nordic = (field, cross, inner, cu = .36, w = 20, wi = 8) => box(0, 0, 1, 1, field) + box(0, .5 - V(w / 2), 1, .5 + V(w / 2), cross) + box(cu - U(w / 2), 0, cu + U(w / 2), 1, cross) +
  (inner ? box(0, .5 - V(wi / 2), 1, .5 + V(wi / 2), inner) + box(cu - U(wi / 2), 0, cu + U(wi / 2), 1, inner) : "");
// Canadian maple leaf (right half, mirrored), unit coordinates, y down.
const LEAF = [[0, -1], [.09, -.78], [.2, -.84], [.19, -.56], [.4, -.7], [.37, -.46], [.7, -.52], [.64, -.3], [.92, -.2], [.62, .06], [.7, .26], [.3, .2], [.28, .34], [.07, .3], [.05, .78]];
const leaf = (cu, cv, R, fill) => poly(LEAF.concat(LEAF.slice(1, -1).reverse().map(([x, y]) => [-x, y])).map(([x, y]) => [cu + U(x * R), cv + V(y * R)]), fill, 2);

// Each flag: (A, B, C) = the team's primary, secondary and accent colors, assigned to the flag's colors in order.
const FLAGS = {
  us: (A, B, C) => { let o = ""; for (let i = 0; i < 13; i++) o += box(0, i / 13, 1, (i + 1) / 13, i % 2 ? C : A); o += box(0, 0, .42, 7 / 13, B);
    for (let r = 0; r < 9; r++) for (let c = 0; c < (r % 2 ? 5 : 6); c++) o += star(.42 * ((r % 2 ? 2 * c + 2 : 2 * c + 1) / 12), (r + .5) / 9 * (7 / 13), 2.6, C, 5); return o; },
  ca: (A, B, C) => box(0, 0, .25, 1, A) + box(.25, 0, .75, 1, C) + box(.75, 0, 1, 1, A) + leaf(.5, .5, 44, A),
  se: (A, B) => nordic(A, B, null, .34, 22),
  fi: (A, B, C) => nordic(C, A, null, .36, 22),
  no: (A, B, C) => nordic(A, C, B, .34, 24, 11),
  ru: (A, B, C) => hbands([A, B, C], [1, 1, 1]),
  cz: (A, B, C) => box(0, 0, 1, .5, A) + box(0, .5, 1, 1, B) + poly([[0, 0], [.5, .5], [0, 1]], C),
  ch: (A, B, C) => box(0, 0, 1, 1, A) + box(.5 - U(12), .5 - V(40), .5 + U(12), .5 + V(40), C) + box(.5 - U(40), .5 - V(12), .5 + U(40), .5 + V(12), C),
  de: (A, B, C) => hbands([A, B, C], [1, 1, 1]),
  fr: (A, B, C) => vbands([A, B, C], [1, 1, 1]),
  rs: (A, B, C) => hbands([A, B, C], [1, 1, 1]) + poly([[.2, .22], [.34, .22], [.34, .5], [.27, .62], [.2, .5]], A) + poly([[.23, .27], [.31, .27], [.31, .47], [.27, .54], [.23, .47]], C),
  gr: (A, B, C) => { let o = ""; for (let i = 0; i < 9; i++) o += box(0, i / 9, 1, (i + 1) / 9, i % 2 ? C : A); const w = U(5 / 9 * FH); o += box(0, 0, w, 5 / 9, A) + box(w / 2 - U(7), 0, w / 2 + U(7), 5 / 9, C) + box(0, 5 / 18 - V(7), w, 5 / 18 + V(7), C); return o; },
  si: (A, B, C) => hbands([C, B, A], [1, 1, 1]) + poly([[.1, .1], [.26, .1], [.26, .42], [.18, .55], [.1, .42]], B) + poly([[.12, .14], [.24, .14], [.24, .4], [.18, .5], [.12, .4]], C) + poly([[.13, .38], [.18, .24], [.23, .38]], A),
  cm: (A, B, C) => vbands([A, B, C], [1, 1, 1]) + star(.5, .5, 17, C),
  au: (A, B, C) => box(0, 0, 1, 1, A) + box(0, 0, .5, .5, A) +
    poly([[0, 0], [.07, 0], [.5, .5 - V(1)], [.5, .5], [.43, .5], [0, .05]], C, 14) + poly([[.5, 0], [.43, 0], [0, .5 - V(1)], [0, .5], [.07, .5], [.5, .05]], C, 14) +
    box(.25 - U(9), 0, .25 + U(9), .5, C) + box(0, .25 - V(9), .5, .25 + V(9), C) + box(.25 - U(5), 0, .25 + U(5), .5, B) + box(0, .25 - V(5), .5, .25 + V(5), B) +
    star(.25, .78, 19, C, 7) + star(.76, .15, 8, C, 7) + star(.64, .42, 8, C, 7) + star(.86, .4, 8, C, 7) + star(.76, .7, 8, C, 7),
  tr: (A, B, C) => box(0, 0, 1, 1, A) + disc(.36, .5, 34, C) + disc(.415, .5, 27, A) + star(.58, .5, 17, C, 5, -90),
  il: (A, B, C) => box(0, 0, 1, 1, C) + box(0, .09, 1, .24, A) + box(0, .76, 1, .91, A) +
    poly([[.5, .5 - V(34)], [.5 + U(29), .5 + V(17)], [.5 - U(29), .5 + V(17)]], "", 1, [A, 3]) + poly([[.5, .5 + V(34)], [.5 + U(29), .5 - V(17)], [.5 - U(29), .5 - V(17)]], "", 1, [A, 3]),
  lt: (A, B, C) => hbands([A, B, C], [1, 1, 1]),
  do: (A, B, C) => box(0, 0, .5, .5, A) + box(.5, 0, 1, .5, B) + box(0, .5, .5, 1, B) + box(.5, .5, 1, 1, A) + box(.5 - U(9), 0, .5 + U(9), 1, C) + box(0, .5 - V(9), 1, .5 + V(9), C),
  ve: (A, B, C) => { let o = hbands([A, B, C], [1, 1, 1]); for (let i = 0; i < 8; i++) { const a = (205 + i * 130 / 7) * Math.PI / 180; o += star(.5 + U(36 * Math.cos(a)), .66 + V(36 * Math.sin(a)), 5, A); } return o; },
  cu: (A, B, C) => { let o = ""; for (let i = 0; i < 5; i++) o += box(0, i / 5, 1, (i + 1) / 5, i % 2 ? C : A); return o + poly([[0, 0], [.4, .5], [0, 1]], B) + star(.13, .5, 16, C); },
  jp: (A, B, C) => box(0, 0, 1, 1, C) + disc(.5, .5, 36, A),
  pr: (A, B, C) => { let o = ""; for (let i = 0; i < 5; i++) o += box(0, i / 5, 1, (i + 1) / 5, i % 2 ? C : B); return o + poly([[0, 0], [.4, .5], [0, 1]], A) + star(.13, .5, 16, C); }
};

function flagSVG(t) {
  const { c1, c2, c3 } = t;
  const id = "f" + Math.random().toString(36).slice(2, 7);
  const art = (FLAGS[t.cap && t.cap.country] || FLAGS.de)(c1, c2, c3);

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

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" role="img" aria-label="Mystery flag in a team's colors">` +
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
