// Draws a home jersey as detailed SVG from a team's colors (no logos or wordmarks).
// A stylised, color-accurate recreation: fabric shading, seams, collar, trim and numbers.
function lum(hex) { const n = parseInt(hex.slice(1), 16); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(n >> 16) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); }
function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function best(bg, cands) { return cands.slice().sort((a, b) => contrast(bg, b) - contrast(bg, a))[0]; }
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

const FONT = "'Arial Black','Impact','Helvetica Neue',Arial,sans-serif";

// Left-half geometry. Torso is symmetric about x=150; the left sleeve is mirrored for the right.
const GEO = {
  football: {
    torso: "M100 22L124 14Q150 34 176 14L200 22L206 190Q150 198 94 190Z",
    sleeve: "M99 24L54 38L32 90L64 108L98 80Z", cuff: [[32, 90], [64, 108]], tip: [75, 62], pit: [98, 80], numAt: [62, 72, -30]
  },
  baseball: {
    torso: "M102 22L126 14Q150 30 174 14L198 22L204 190Q150 197 96 190Z",
    sleeve: "M101 24L62 38L40 78L68 94L99 68Z", cuff: [[40, 78], [68, 94]], tip: [78, 58], pit: [99, 68]
  },
  hockey: {
    torso: "M100 24L126 16Q150 34 174 16L200 24L206 192Q150 199 94 192Z",
    sleeve: "M99 26L60 36L18 126L50 142L86 84L99 74Z", cuff: [[18, 126], [50, 142]], tip: [64, 90], pit: [95, 80], numAt: [58, 84, -24]
  },
  basketball: {
    torso: "M106 14L128 14Q150 70 172 14L194 14Q190 60 204 88L216 192Q150 200 84 192L96 88Q110 60 106 14Z",
    sleeve: null, pit: [98, 90]
  }
};

const mirror = s => `<g transform="translate(300 0) scale(-1 1)">${s}</g>`;
const both = s => s + mirror(s);

function bandOf(g, k, w, col) {
  const [[px, py], [qx, qy]] = g.cuff; let dx = qx - px, dy = qy - py; const d = Math.hypot(dx, dy); dx /= d; dy /= d;
  let nx = -dy, ny = dx; if ((g.tip[0] - px) * nx + (g.tip[1] - py) * ny < 0) { nx = -nx; ny = -ny; }
  const e = 24;
  return `<line x1="${px - dx * e + nx * k}" y1="${py - dy * e + ny * k}" x2="${qx + dx * e + nx * k}" y2="${qy + dy * e + ny * k}" stroke="${col}" stroke-width="${w}"/>`;
}
const bands = (g, list) => list.map(([k, w, c]) => bandOf(g, k, w, c)).join("");

function jerseySVG(sport, t, num) {
  const { c1, c2, c3 } = t;
  const g = GEO[sport], uid = "j" + Math.random().toString(36).slice(2, 7);
  const v = hashStr(t.name) % 4;
  const ink = best(c1, [c2, c3, "#ffffff", "#111111"]);
  const outline = best(ink, [c2, c3, "#ffffff", "#111111"].filter(c => c !== ink));
  const hasSleeves = !!g.sleeve;
  const sleeveFill = sport === "baseball" && v === 3 && !t.pin ? c2 : c1;

  // ---- trim, drawn inside the silhouette clip ----
  let trim = "";
  const rect = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
  if (sport === "football") {
    const sl = [[[14, 6, c2], [25, 3, c3]], [[10, 5, c2], [19, 5, c3], [28, 5, c2]], [[7, 5, c3]], [[8, 4, c3]]][v];
    trim += both(bands(g, sl));
    if (v === 2) trim += `<path d="M100 22L124 14Q150 34 176 14L200 22L203 48Q150 70 97 48Z" fill="${c2}"/><path d="M97 52Q150 74 203 52" fill="none" stroke="${c3}" stroke-width="2.5"/>`;
    if (v === 3) trim += both(`<path d="M94 84h13v112h-13z" fill="${c2}"/><path d="M108 84v112" stroke="${c3}" stroke-width="2"/>`);
    if (v === 0) trim += rect(94, 183, 112, 4, c2);
  } else if (sport === "baseball") {
    trim += both(bands(g, [[[8, 5, c2], [16, 2, c3]], [[10, 4, c2]], [[7, 4, c3]], [[8, 5, c1]]][v]));
    if (v !== 3 || t.pin) trim += `<line x1="150" y1="22" x2="150" y2="196" stroke="${c2}" stroke-width="7"/><line x1="146.5" y1="22" x2="146.5" y2="196" stroke="${c3}" stroke-width="1.2"/><line x1="153.5" y1="22" x2="153.5" y2="196" stroke="${c3}" stroke-width="1.2"/>`;
    if (v === 1 && !t.pin) trim += both(`<path d="M126 14L100 68" stroke="${c2}" stroke-width="3" fill="none"/>`);
    if (v === 2 && !t.pin) trim += rect(94, 182, 112, 6, c2);
    if (v === 3 && !t.pin) trim += `<line x1="150" y1="22" x2="150" y2="196" stroke="${c3}" stroke-width="2.5"/>`;
    if (t.pin) for (let x = 24; x < 280; x += 7) trim += `<line x1="${x}" y1="0" x2="${x}" y2="200" stroke="${c2}" stroke-width="1.3" opacity=".6"/>`;
  } else if (sport === "hockey") {
    trim += both(bands(g, v === 3 ? [[8, 14, c2], [24, 3, c3]] : [[8, 7, c2], [18, 3, c3], [26, 7, c2]]));
    if (v === 0) trim += rect(94, 158, 112, 9, c2) + rect(94, 170, 112, 4, c3) + rect(94, 177, 112, 9, c2);
    if (v === 1) trim += `<path d="M100 24L126 16Q150 34 174 16L200 24L203 52Q150 72 97 52Z" fill="${c2}"/><path d="M97 56Q150 76 203 56" fill="none" stroke="${c3}" stroke-width="2.5"/>` + rect(94, 172, 112, 8, c2);
    if (v === 2) trim += rect(94, 142, 112, 11, c2) + rect(94, 156, 112, 4, c3) + rect(94, 176, 112, 10, c2);
    if (v === 3) trim += rect(94, 168, 112, 18, c2) + rect(94, 163, 112, 3, c3);
  } else {
    // basketball
    trim += `<path d="M128 14Q150 70 172 14" fill="none" stroke="${c2}" stroke-width="7"/><path d="M128 14Q150 70 172 14" fill="none" stroke="${c3}" stroke-width="1.5" transform="translate(0 4)"/>`;
    trim += both(`<path d="M106 14Q110 60 96 88" fill="none" stroke="${c2}" stroke-width="7"/>`);
    if (v === 0) trim += both(`<path d="M96 88L84 192" stroke="${c2}" stroke-width="12"/><path d="M104 88L93 192" stroke="${c3}" stroke-width="3"/>`) + rect(80, 183, 140, 8, c2);
    if (v === 1) trim += `<path d="M112 58L150 88L188 58" fill="none" stroke="${c2}" stroke-width="7" stroke-linejoin="round"/><path d="M112 68L150 98L188 68" fill="none" stroke="${c3}" stroke-width="3" stroke-linejoin="round"/>` + both(`<path d="M96 88L84 192" stroke="${c2}" stroke-width="5"/>`);
    if (v === 2) trim += rect(80, 58, 140, 9, c2) + rect(80, 70, 140, 4, c3) + both(`<path d="M96 88L84 192" stroke="${c3}" stroke-width="4"/>`);
    if (v === 3) trim += `<path d="M80 176L115 162L150 176L185 162L220 176V196H80Z" fill="${c2}"/><path d="M80 170L115 156L150 170L185 156L220 170" fill="none" stroke="${c3}" stroke-width="3"/>`;
  }

  // ---- collar ----
  let collar = "";
  if (sport === "football" || sport === "hockey") {
    collar += `<path d="M126 15Q150 34 174 15L150 54Z" fill="#0b0d12" opacity=".6"/>`;
    collar += `<path d="M120 13L150 64L180 13L172 13L150 50L128 13Z" fill="${c2}" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="M127 14L150 53L173 14" fill="none" stroke="${c3}" stroke-width="1.2" opacity=".85"/>`;
    if (sport === "hockey") for (let i = 0; i < 4; i++) { const y = 26 + i * 6, h = (50 - y) * .5 + 1; collar += `<line x1="${150 - h}" y1="${y}" x2="${150 + h}" y2="${y}" stroke="${c3}" stroke-width="1.4"/>`; }
  } else if (sport === "baseball") {
    collar += `<path d="M126 15Q150 36 174 15L150 28Z" fill="#0b0d12" opacity=".5"/><path d="M123 13Q150 34 177 13L177 21Q150 42 123 21Z" fill="${c2}" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="M123 17Q150 38 177 17" fill="none" stroke="${c3}" stroke-width="1.2"/>`;
    for (let y = 44; y < 190; y += 24) collar += `<circle cx="150" cy="${y}" r="2.6" fill="${best(c2, [c3, "#fff"])}" stroke="rgba(0,0,0,.4)" stroke-width=".8"/>`;
  } else {
    collar += `<path d="M128 14Q150 70 172 14Q150 36 128 14Z" fill="#0b0d12" opacity=".35"/>`;
  }

  // ---- shading, texture, seams ----
  const silhouette = (hasSleeves ? `<path d="${g.sleeve}"/><path transform="translate(300 0) scale(-1 1)" d="${g.sleeve}"/>` : "") + `<path d="${g.torso}"/>`;
  const textured = sport === "basketball" ? `url(#${uid}m)` : `url(#${uid}t)`;
  const [px, py] = g.pit;
  const armpit = hasSleeves ? both(`<ellipse cx="${px}" cy="${py + 6}" rx="10" ry="16" fill="url(#${uid}a)"/>`) : both(`<ellipse cx="${px + 4}" cy="${py + 2}" rx="8" ry="18" fill="url(#${uid}a)"/>`);
  const wrinkles = `<g filter="url(#${uid}b)" fill="none" stroke-linecap="round" stroke-width="2.4">` +
    `<path d="M112 112Q128 120 120 146" stroke="#000" opacity=".12"/><path d="M188 104Q172 126 182 150" stroke="#000" opacity=".12"/>` +
    `<path d="M126 90Q136 98 130 118" stroke="#fff" opacity=".12"/><path d="M168 150Q176 164 170 180" stroke="#000" opacity=".1"/>` +
    `<path d="M104 150Q114 160 108 182" stroke="#fff" opacity=".1"/></g>`;
  const seams = `<g fill="none" stroke="rgba(0,0,0,.38)" stroke-width=".9" stroke-dasharray="2.4 2">` +
    (hasSleeves ? both(`<path d="${g.sleeve.split("L").slice(0, 1)[0]}L${g.pit[0]} ${g.pit[1]}"/><path d="M${g.pit[0] + 1} ${g.pit[1]}L${g.pit[0] - 1} 188"/>`) : both(`<path d="M${px + 3} ${py}L${px - 8} 188"/>`)) +
    `<path d="M${hasSleeves ? 96 : 84} 188Q150 195 ${hasSleeves ? 204 : 216} 188"/></g>`;
  const sleeveNums = !hasSleeves || !g.numAt ? "" : (() => {
    const [x, y, r] = g.numAt, nf = best(sleeveFill, [c2, c3, "#fff", "#111"]);
    const one = (xx, rr) => `<text x="${xx}" y="${y}" transform="rotate(${rr} ${xx} ${y})" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="900" font-size="17" fill="${nf}" stroke="${best(nf, [c2, c3, "#fff", "#111"].filter(c => c !== nf))}" stroke-width="1.6" paint-order="stroke">${num}</text>`;
    return one(x, r) + one(300 - x, -r);
  })();

  const ny = sport === "basketball" ? 128 : sport === "baseball" ? 118 : 132;
  const nx = sport === "baseball" ? 124 : 150, nsize = sport === "baseball" ? 40 : sport === "basketball" ? 64 : 62;
  const number = `<g filter="url(#${uid}s)"><text x="${nx}" y="${ny}" text-anchor="middle" font-family="${FONT}" font-weight="900" font-size="${nsize}" fill="${ink}" stroke="${outline}" stroke-width="${nsize > 50 ? 6 : 4}" stroke-linejoin="round" paint-order="stroke">${num}</text></g>`;

  const light = lum(c1) > .45;
  const bg = light ? ["#c4c9d4", "#9ea5b5"] : ["#eef0f5", "#d2d6e0"];
  const dark = "rgba(0,0,0,.38)";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" role="img" aria-label="Mystery jersey">` +
    `<defs>
      <linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
      <linearGradient id="${uid}h" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="280" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".22" stop-color="#000" stop-opacity=".04"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset=".78" stop-color="#000" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
      <linearGradient id="${uid}v" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="196"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <radialGradient id="${uid}a"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <pattern id="${uid}t" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="2" fill="#fff" opacity=".06"/></pattern>
      <pattern id="${uid}m" width="3.6" height="3.6" patternUnits="userSpaceOnUse"><circle cx="1.8" cy="1.8" r=".75" fill="#000" opacity=".16"/></pattern>
      <filter id="${uid}b"><feGaussianBlur stdDeviation="1.6"/></filter>
      <filter id="${uid}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000" flood-opacity=".4"/></filter>
      <filter id="${uid}d" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".32"/></filter>
      <clipPath id="${uid}c">${silhouette}</clipPath>
    </defs>` +
    `<rect width="300" height="200" fill="url(#${uid}bg)"/>` +
    `<ellipse cx="150" cy="196" rx="96" ry="5" fill="#000" opacity=".14"/>` +
    `<g filter="url(#${uid}d)">` +
      (hasSleeves ? `<path d="${g.sleeve}" fill="${sleeveFill}"/>${mirror(`<path d="${g.sleeve}" fill="${sleeveFill}"/>`)}` : "") +
      `<path d="${g.torso}" fill="${c1}"/></g>` +
    `<g clip-path="url(#${uid}c)">${trim}` +
      `<rect width="300" height="200" fill="url(#${uid}h)"/><rect width="300" height="200" fill="url(#${uid}v)"/>${armpit}${wrinkles}` +
      `<rect width="300" height="200" fill="${textured}"/>${seams}</g>` +
    `<g fill="none" stroke="${dark}" stroke-width="1.4" stroke-linejoin="round">${hasSleeves ? `<path d="${g.sleeve}"/>${mirror(`<path d="${g.sleeve}"/>`)}` : ""}<path d="${g.torso}"/></g>` +
    collar + sleeveNums + number + `</svg>`;
}
