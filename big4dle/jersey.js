// Draws a home jersey as detailed SVG from a team's colors (no logos or wordmarks).
// Stylised, color-accurate recreation: fabric shading, seams, stitching, collars, trim and twill numbers.
function lum(hex) { const n = parseInt(hex.slice(1), 16); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(n >> 16) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); }
function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
function best(bg, cands) { return cands.slice().sort((a, b) => contrast(bg, b) - contrast(bg, a))[0]; }
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

const FONT_BLOCK = "JerseyBlock,'Arial Black',Impact,sans-serif";
const FONT_TALL = "JerseyTall,Impact,'Arial Narrow',sans-serif";

// Left-half geometry. Torso is symmetric about x=150; the left sleeve is mirrored for the right.
// sleeveNum: [x, y, rotation] along the sleeve axis (toward the shoulder), size.
const GEO = {
  football: {
    torso: "M100 22L124 14Q150 34 176 14L200 22Q204 100 206 190Q150 198 94 190Q96 100 100 22Z",
    sleeve: "M99 24L54 38Q40 62 32 90Q48 102 64 108L98 80Z", cuff: [[32, 90], [64, 108]], tip: [75, 62], pit: [98, 80],
    num: { x: 150, y: 126, size: 60, font: FONT_BLOCK }, sleeveNum: [66, 62, 22, 19]
  },
  baseball: {
    torso: "M102 22L126 14Q150 30 174 14L198 22Q202 100 204 190Q150 197 96 190Q98 100 102 22Z",
    sleeve: "M101 24L62 38Q50 56 40 78Q54 88 68 94L99 68Z", cuff: [[40, 78], [68, 94]], tip: [78, 58], pit: [99, 68],
    num: { x: 123, y: 112, size: 34, font: FONT_BLOCK }
  },
  hockey: {
    torso: "M100 24L126 16Q150 34 174 16L200 24Q204 110 206 192Q150 199 94 192Q96 110 100 24Z",
    sleeve: "M99 26L60 36Q38 80 18 126Q34 136 50 142L86 84L99 74Z", cuff: [[18, 126], [50, 142]], tip: [64, 90], pit: [95, 80],
    sleeveNum: [66, 70, 24, 30]
  },
  basketball: {
    torso: "M106 14L128 14Q150 70 172 14L194 14Q190 60 204 88Q212 140 216 192Q150 200 84 192Q88 140 96 88Q110 60 106 14Z",
    sleeve: null, pit: [98, 90],
    num: { x: 150, y: 134, size: 70, font: FONT_TALL }
  }
};

const mirror = s => `<g transform="translate(300 0) scale(-1 1)">${s}</g>`;
const both = s => s + mirror(s);

function bandOf(g, k, w, col, extra = "") {
  const [[px, py], [qx, qy]] = g.cuff; let dx = qx - px, dy = qy - py; const d = Math.hypot(dx, dy); dx /= d; dy /= d;
  let nx = -dy, ny = dx; if ((g.tip[0] - px) * nx + (g.tip[1] - py) * ny < 0) { nx = -nx; ny = -ny; }
  const e = 24;
  return `<line x1="${px - dx * e + nx * k}" y1="${py - dy * e + ny * k}" x2="${qx + dx * e + nx * k}" y2="${qy + dy * e + ny * k}" stroke="${col}" stroke-width="${w}" ${extra}/>`;
}
const bands = (g, list) => list.map(([k, w, c]) => bandOf(g, k, w, c)).join("");

// Tackle-twill style number: border, fill, sheen and stitching.
function twill(txt, x, y, size, font, fill, border, id, rot = "") {
  const tr = rot ? ` transform="${rot}"` : "";
  const common = `x="${x}" y="${y}" text-anchor="middle" font-family="${font}" font-weight="700" font-size="${size}" letter-spacing="${size * .02}"`;
  const bw = Math.max(2, size * .075);
  return `<g${tr} filter="url(#${id}s)">` +
    `<text ${common} fill="${border}" stroke="${border}" stroke-width="${bw * 2}" stroke-linejoin="round">${txt}</text>` +
    `<text ${common} fill="${fill}" stroke="${fill}" stroke-width=".6" stroke-linejoin="round">${txt}</text>` +
    `<text ${common} fill="url(#${id}n)" opacity=".42">${txt}</text></g>`;
}

function jerseySVG(sport, t, num) {
  const { c1, c2, c3 } = t;
  const g = GEO[sport], id = "j" + Math.random().toString(36).slice(2, 7);
  const v = hashStr(t.name) % 4;
  const hasSleeves = !!g.sleeve;
  const sleeveFill = sport === "baseball" && v === 3 && !t.pin ? c2 : c1;
  const pickFill = bg => [c2, c3, "#ffffff", "#111111"].find(c => contrast(bg, c) >= 3) || best(bg, [c2, c3, "#ffffff", "#111111"]);
  const pickBorder = (fill, bg) => [c2, c3, "#111111", "#ffffff"].find(c => c !== fill && contrast(fill, c) >= 1.5 && contrast(bg, c) >= 1.3) || best(fill, [c2, c3, "#ffffff", "#111111"].filter(c => c !== fill));
  const numFill = pickFill(c1);
  const numBorder = pickBorder(numFill, c1);
  const rect = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;

  // ---- trim (clipped to the garment) ----
  let trim = "";
  if (sport === "football") {
    trim += both(bands(g, [[[14, 6, c2], [25, 3, c3]], [[10, 5, c2], [19, 5, c3], [28, 5, c2]], [[7, 5, c3]], [[8, 4, c3]]][v]));
    if (v === 2) trim += `<path d="M100 22L124 14Q150 34 176 14L200 22L203 48Q150 70 97 48Z" fill="${c2}"/><path d="M97 52Q150 74 203 52" fill="none" stroke="${c3}" stroke-width="2.5"/>`;
    if (v === 3) trim += both(`<path d="M94 84h13v112h-13z" fill="${c2}"/><path d="M108 84v112" stroke="${c3}" stroke-width="2"/>`);
    if (v === 0) trim += rect(94, 183, 112, 4, c2);
  } else if (sport === "baseball") {
    trim += both(bands(g, [[[8, 5, c2], [16, 2, c3]], [[10, 4, c2]], [[7, 4, c3]], [[8, 5, c1]]][v]));
    if (v !== 3 || t.pin) trim += `<line x1="150" y1="22" x2="150" y2="196" stroke="${c2}" stroke-width="8"/><line x1="146" y1="22" x2="146" y2="196" stroke="${c3}" stroke-width="1"/><line x1="154" y1="22" x2="154" y2="196" stroke="${c3}" stroke-width="1"/>`;
    if (v === 1 && !t.pin) trim += both(`<path d="M126 14L100 68" stroke="${c2}" stroke-width="3" fill="none"/>`);
    if (v === 2 && !t.pin) trim += rect(94, 181, 112, 7, c2);
    if (v === 3 && !t.pin) trim += `<line x1="150" y1="22" x2="150" y2="196" stroke="${c3}" stroke-width="3"/>`;
    if (t.pin) for (let x = 24; x < 280; x += 6.5) trim += `<line x1="${x}" y1="0" x2="${x}" y2="200" stroke="${c2}" stroke-width="1.2" opacity=".62"/>`;
  } else if (sport === "hockey") {
    trim += both(bands(g, v === 3 ? [[8, 14, c2], [24, 3, c3]] : [[8, 7, c2], [18, 3, c3], [26, 7, c2]]));
    if (v === 0) trim += rect(94, 156, 112, 9, c2) + rect(94, 168, 112, 4, c3) + rect(94, 175, 112, 9, c2);
    if (v === 1) trim += `<path d="M100 24L126 16Q150 34 174 16L200 24L203 54Q150 74 97 54Z" fill="${c2}"/><path d="M97 58Q150 78 203 58" fill="none" stroke="${c3}" stroke-width="2.5"/>` + rect(94, 170, 112, 8, c2);
    if (v === 2) trim += rect(94, 138, 112, 11, c2) + rect(94, 152, 112, 4, c3) + rect(94, 174, 112, 10, c2);
    if (v === 3) trim += rect(94, 166, 112, 18, c2) + rect(94, 161, 112, 3, c3);
  } else {
    if (v === 0) trim += both(`<path d="M96 88L84 192" stroke="${c2}" stroke-width="12"/><path d="M104 88L93 192" stroke="${c3}" stroke-width="3"/>`) + rect(80, 182, 140, 9, c2);
    if (v === 1) trim += `<path d="M112 40L150 68L188 40" fill="none" stroke="${c2}" stroke-width="7" stroke-linejoin="round"/><path d="M112 50L150 78L188 50" fill="none" stroke="${c3}" stroke-width="3" stroke-linejoin="round"/>` + both(`<path d="M96 88L84 192" stroke="${c2}" stroke-width="5"/>`);
    if (v === 2) trim += rect(80, 60, 140, 9, c2) + rect(80, 72, 140, 4, c3) + both(`<path d="M96 88L84 192" stroke="${c3}" stroke-width="4"/>`);
    if (v === 3) trim += `<path d="M80 176L115 162L150 176L185 162L220 176V196H80Z" fill="${c2}"/><path d="M80 170L115 156L150 170L185 156L220 170" fill="none" stroke="${c3}" stroke-width="3"/>`;
    trim += `<path d="M128 14Q150 70 172 14" fill="none" stroke="${c2}" stroke-width="7"/>` + both(`<path d="M106 14Q110 60 96 88" fill="none" stroke="${c2}" stroke-width="7"/>`);
  }

  // ---- fabric details ----
  const [px, py] = g.pit;
  const armpit = both(`<ellipse cx="${px + (hasSleeves ? 0 : 4)}" cy="${py + 6}" rx="${hasSleeves ? 10 : 8}" ry="17" fill="url(#${id}a)"/>`);
  const sidePanels = sport === "football" || sport === "hockey" ? both(`<path d="M${px - 1} ${py + 2}L95 192L${sport === "hockey" ? 105 : 107} 192L${px + 8} ${py + 8}Z" fill="rgba(0,0,0,.10)"/><path d="M${px - 1} ${py + 2}L95 192L${sport === "hockey" ? 105 : 107} 192L${px + 8} ${py + 8}Z" fill="url(#${id}m)"/>`) : "";
  const sleeveFolds = hasSleeves ? both(`<g filter="url(#${id}b)" fill="none" stroke-linecap="round" stroke-width="2.4"><path d="M${px} ${py} Q${(px + g.cuff[0][0]) / 2 + 12} ${py + 6} ${(g.cuff[0][0] + g.cuff[1][0]) / 2 + 2} ${(g.cuff[0][1] + g.cuff[1][1]) / 2 - 6}" stroke="#000" opacity=".16"/><path d="M${g.tip[0] + 4} ${g.tip[1] - 22}Q${g.tip[0] - 6} ${g.tip[1]} ${g.tip[0] - 8} ${g.tip[1] + 22}" stroke="#fff" opacity=".13"/></g>`) : "";
  const wrinkles = `<g filter="url(#${id}b)" fill="none" stroke-linecap="round" stroke-width="2.4">` +
    `<path d="M112 108Q128 118 120 146" stroke="#000" opacity=".13"/><path d="M188 100Q172 124 182 152" stroke="#000" opacity=".13"/>` +
    `<path d="M126 86Q138 96 132 120" stroke="#fff" opacity=".14"/><path d="M168 150Q178 164 171 182" stroke="#000" opacity=".11"/>` +
    `<path d="M106 150Q116 162 109 184" stroke="#fff" opacity=".1"/><path d="M${px + 2} ${py + 8}Q${px + 16} ${py + 24} ${px + 10} ${py + 44}" stroke="#000" opacity=".12"/></g>`;
  const stitchStyle = `fill="none" stroke="rgba(0,0,0,.42)" stroke-width=".8" stroke-dasharray="2.2 1.8"`;
  const armholeSeam = hasSleeves ? both(`<path ${stitchStyle} d="M${g.sleeve.match(/M(\d+) (\d+)/).slice(1).join(" ")}L${px} ${py}"/><path ${stitchStyle} d="M${px + 2.5} ${g.sleeve.match(/M(\d+) (\d+)/)[2] - 0 + 2}L${px + 2.5} ${py}"/>`) : both(`<path ${stitchStyle} d="M${px + 3} ${py}Q${px - 2} 140 ${px - 8} 188"/>`);
  const hem = `<path ${stitchStyle} d="M${hasSleeves ? 95 : 85} 183Q150 190 ${hasSleeves ? 205 : 215} 183"/><path ${stitchStyle} d="M${hasSleeves ? 95 : 85} 186.5Q150 193.5 ${hasSleeves ? 205 : 215} 186.5"/>`;
  const cuffs = hasSleeves ? both(bandOf(g, 1.5, 3.2, "rgba(0,0,0,.3)") + bandOf(g, 5, .9, "rgba(255,255,255,.28)") + bandOf(g, 3.2, .7, "rgba(0,0,0,.4)", 'stroke-dasharray="2 1.6"')) : "";
  const shoulderSeam = sport === "basketball" ? "" : `<path ${stitchStyle} d="M${hasSleeves ? 100 : 106} 25L126 18"/>` + mirror(`<path ${stitchStyle} d="M${hasSleeves ? 100 : 106} 25L126 18"/>`);

  // ---- collar ----
  let collar = "";
  if (sport === "football" || sport === "hockey") {
    collar += `<path d="M126 15Q150 34 174 15L150 54Z" fill="#0b0d12" opacity=".62"/><path d="M129 16Q150 30 171 16" fill="none" stroke="${c3}" stroke-width="2.2" opacity=".75"/>`;
    collar += `<path d="M120 13L150 64L180 13L172 13L150 50L128 13Z" fill="${c2}" stroke="rgba(0,0,0,.4)" stroke-width="1"/>`;
    collar += `<path d="M124 14L150 57M176 14L150 57" stroke="rgba(0,0,0,.28)" stroke-width="5" stroke-dasharray=".9 1.6" fill="none"/>`;
    collar += `<path d="M127 14L150 53L173 14" fill="none" stroke="${c3}" stroke-width="1.1" opacity=".8"/>`;
    if (sport === "hockey") {
      const L = s => [126 + 24 * s, 15 + 39 * s], R = s => [174 - 24 * s, 15 + 39 * s];
      for (let i = 0; i < 4; i++) { const a = L(.14 + i * .2), b = R(.34 + i * .2), c = R(.14 + i * .2), d = L(.34 + i * .2); collar += `<path d="M${a} L${b} M${c} L${d}" stroke="#f4f4f0" stroke-width="1.5" fill="none"/>`; }
      for (let i = 0; i < 5; i++) { const a = L(.14 + i * .2), b = R(.14 + i * .2); collar += `<circle cx="${a[0]}" cy="${a[1]}" r="1.3" fill="#101216"/><circle cx="${b[0]}" cy="${b[1]}" r="1.3" fill="#101216"/>`; }
      collar += `<path d="M149 52L145 68M151 52L155 68" stroke="#f4f4f0" stroke-width="1.5" stroke-linecap="round"/><circle cx="145" cy="68.5" r="1.6" fill="#f4f4f0"/><circle cx="155" cy="68.5" r="1.6" fill="#f4f4f0"/>`;
    }
  } else if (sport === "baseball") {
    collar += `<path d="M126 15Q150 36 174 15L150 28Z" fill="#0b0d12" opacity=".55"/><path d="M123 13Q150 34 177 13L177 21Q150 42 123 21Z" fill="${c2}" stroke="rgba(0,0,0,.4)" stroke-width="1"/><path d="M123 17Q150 38 177 17" fill="none" stroke="${c3}" stroke-width="1.1"/><path d="M124 19Q150 40 176 19" fill="none" stroke="rgba(0,0,0,.35)" stroke-width=".7" stroke-dasharray="2 1.6"/>`;
    for (let y = 46; y < 188; y += 23) collar += `<circle cx="150" cy="${y}" r="2.7" fill="${best(c2, [c3, "#f4f4f0"])}" stroke="rgba(0,0,0,.45)" stroke-width=".8"/><circle cx="149.2" cy="${y - .8}" r="1" fill="rgba(255,255,255,.55)"/><path d="M148.4 ${y}h3.2M150 ${y - 1.6}v3.2" stroke="rgba(0,0,0,.4)" stroke-width=".5"/>`;
  } else {
    collar += `<path d="M128 14Q150 70 172 14Q150 36 128 14Z" fill="#0b0d12" opacity=".35"/><path d="M128 14Q150 70 172 14" fill="none" stroke="${c3}" stroke-width="1.4" transform="translate(0 4.5)"/>`;
  }

  // ---- numbers ----
  let numbers = "";
  if (g.num) numbers += twill(num, g.num.x, g.num.y, g.num.size, g.num.font, numFill, numBorder, id);
  if (g.sleeveNum) {
    const [sx, sy, rot, size] = g.sleeveNum, nf = pickFill(sleeveFill), nb = pickBorder(nf, sleeveFill);
    const font = sport === "hockey" ? FONT_TALL : FONT_BLOCK;
    numbers += twill(num, sx, sy, size * (sport === "hockey" ? 1 : .9), font, nf, nb, id, `rotate(${rot} ${sx} ${sy})`);
    numbers += twill(num, 300 - sx, sy, size * (sport === "hockey" ? 1 : .9), font, nf, nb, id, `rotate(${-rot} ${300 - sx} ${sy})`);
  }

  const light = lum(c1) > .45;
  const bg = light ? ["#c4c9d4", "#9ea5b5"] : ["#eef0f5", "#d2d6e0"];
  const sleevePath = hasSleeves ? `<path d="${g.sleeve}"/><path transform="translate(300 0) scale(-1 1)" d="${g.sleeve}"/>` : "";
  const textured = sport === "basketball" ? `url(#${id}m)` : `url(#${id}t)`;
  const outline = `<g fill="none" stroke="rgba(0,0,0,.4)" stroke-width="1.3" stroke-linejoin="round">${sleevePath}<path d="${g.torso}"/></g>`;

  const garment =
    `<g filter="url(#${id}d)">${hasSleeves ? `<path d="${g.sleeve}" fill="${sleeveFill}"/>${mirror(`<path d="${g.sleeve}" fill="${sleeveFill}"/>`)}` : ""}<path d="${g.torso}" fill="${c1}"/></g>` +
    `<g clip-path="url(#${id}c)">${trim}${sidePanels}` +
    `<rect width="300" height="200" fill="url(#${id}h)"/><rect width="300" height="200" fill="url(#${id}v)"/>${armpit}${sleeveFolds}${wrinkles}` +
    `<rect width="300" height="200" fill="${textured}"/>${cuffs}${armholeSeam}${shoulderSeam}${hem}</g>` +
    outline + collar + numbers;

  const hw = sport === "basketball" ? 38 : 50;
  const hanger = `<g fill="none" stroke-linecap="round"><path d="M150 17V11Q150 3 158 3Q165 3 165 10" stroke="#8d93a3" stroke-width="2"/><path d="M150 17L${150 - hw} 40Q${146 - hw} 43 ${151 - hw} 44H${149 + hw}Q${154 + hw} 43 ${150 + hw} 40Z" fill="#c9a06a" stroke="#9c7647" stroke-width="1.2"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" role="img" aria-label="Mystery jersey">` +
    `<defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
      <linearGradient id="${id}h" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="280" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".22" stop-color="#000" stop-opacity=".04"/><stop offset=".5" stop-color="#fff" stop-opacity=".13"/><stop offset=".78" stop-color="#000" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
      <linearGradient id="${id}v" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="196"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
      <linearGradient id="${id}n" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
      <radialGradient id="${id}a"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <pattern id="${id}t" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="2" fill="#fff" opacity=".06"/></pattern>
      <pattern id="${id}m" width="3.6" height="3.6" patternUnits="userSpaceOnUse"><circle cx="1.8" cy="1.8" r=".75" fill="#000" opacity=".2"/></pattern>
      <filter id="${id}b"><feGaussianBlur stdDeviation="1.6"/></filter>
      <filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.4" stdDeviation="1" flood-color="#000" flood-opacity=".45"/></filter>
      <filter id="${id}d" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".32"/></filter>
      <clipPath id="${id}c">${sleevePath}<path d="${g.torso}"/></clipPath>
    </defs>` +
    `<rect width="300" height="200" fill="url(#${id}bg)"/>` +
    `<ellipse cx="150" cy="196" rx="96" ry="5" fill="#000" opacity=".14"/>` +
    hanger +
    `<g transform="translate(15 17) scale(.9)">${garment}</g></svg>`;
}
