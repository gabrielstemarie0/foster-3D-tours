// ===== Site settings: edit these two lines =====
// Email that "Request a scan" messages go to.
const CONTACT_EMAIL = "you@example.com";
// Link to a live sample tour (e.g. a Matterport share link). Leave "" to show the "Ask for a sample" box.
const SAMPLE_TOUR_URL = "";
// ===============================================

// --- Hero illustration: scan points placed on the isometric floor plan ---
(function drawScanPoints() {
  const svg = document.getElementById("dollhouse");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  // points in floor-plan coordinates (same space as the <g transform> in index.html)
  const points = [
    { x: 170, y: 225, label: "Entry" },
    { x: 60,  y: 212, label: "Bath" },
    { x: 165, y: 115, label: "Living room" },
    { x: 310, y: 60,  label: "Kitchen" },
    { x: 300, y: 185, label: "Bedroom" },
  ];
  const iso = (p) => ({ x: 0.866 * (p.x - p.y), y: 0.5 * (p.x + p.y) });
  const screen = points.map(iso);

  const path = document.getElementById("scan-path");
  path.setAttribute("points", screen.map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(" "));

  const group = document.getElementById("scan-points");
  screen.forEach((s, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "scan-dot");
    g.style.setProperty("--d", `${0.4 + i * 0.42}s`);
    const halo = document.createElementNS(NS, "ellipse");
    halo.setAttribute("class", "halo");
    halo.setAttribute("cx", s.x); halo.setAttribute("cy", s.y);
    halo.setAttribute("rx", 20); halo.setAttribute("ry", 11);
    const core = document.createElementNS(NS, "circle");
    core.setAttribute("class", "core");
    core.setAttribute("cx", s.x); core.setAttribute("cy", s.y - 2); core.setAttribute("r", 7);
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", s.x + 14); t.setAttribute("y", s.y - 12);
    t.textContent = points[i].label;
    g.append(halo, core, t);
    group.appendChild(g);
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    const len = path.getTotalLength ? path.getTotalLength() : 1000;
    path.style.setProperty("--len", len);
    svg.classList.add("is-animating");
    path.addEventListener("animationend", () => {
      svg.classList.remove("is-animating");
      svg.classList.add("is-done");
    }, { once: true });
  }
})();

// --- Sample tour embed ---
(function sampleTour() {
  if (!SAMPLE_TOUR_URL) return;
  const frame = document.getElementById("tour-frame");
  frame.innerHTML = "";
  frame.classList.remove("is-empty");
  document.getElementById("sample-hint").hidden = false;
  const iframe = document.createElement("iframe");
  iframe.src = SAMPLE_TOUR_URL;
  iframe.title = "Sample 3D tour";
  iframe.loading = "lazy";
  iframe.allow = "fullscreen; xr-spatial-tracking";
  iframe.allowFullscreen = true;
  frame.appendChild(iframe);
})();

// --- Contact form: opens the visitor's email app with the details filled in ---
(function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.classList.remove("error");
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    let firstBad = null;
    [["name", name.length > 0], ["email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)]].forEach(([field, ok]) => {
      form[field].setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !firstBad) firstBad = form[field];
    });
    if (firstBad) {
      status.textContent = "Add your name and a valid email so we can reply.";
      status.classList.add("error");
      firstBad.focus();
      return;
    }
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Building address: ${form.address.value.trim() || "-"}`,
      `Units: ${form.units.value.trim() || "-"}`,
      "",
      form.message.value.trim(),
    ];
    const subject = `Scan request${form.address.value.trim() ? " for " + form.address.value.trim() : ""}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    status.textContent = "Your email app should open with the request ready to send.";
  });
})();

document.getElementById("year").textContent = new Date().getFullYear();
