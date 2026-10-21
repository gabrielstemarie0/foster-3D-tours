// ================= SITE SETTINGS =================
// Free form delivery: create an access key at https://web3forms.com using
// foster3dtours@gmail.com, then paste it here. Until it's set, the form
// opens the visitor's email app with the request filled in instead.
const WEB3FORMS_KEY = "b0950a23-f9ad-45f4-a0bd-f7711d5e2c86";
const CONTACT_EMAIL = "foster3dtours@gmail.com";

// Portfolio: Matterport model IDs (the part after "?m=" in a tour link).
// Add, remove or reorder tours here.
const TOURS = [
  { id: "m8MNNAzBDPK", title: "Knob Hill Inn Lobby", type: "Hotel lobby" },
  { id: "CShim2B3aps", title: "480 Walnut Ave N", type: "Home" },
  { id: "fcxhmSfnLGy", title: "110 Stonegate Cir", type: "Home" },
  { id: "FarDYhNKNSx", title: "Baldy Suite", type: "Hotel suite" },
  { id: "zkcMVtkVpgF", title: "Sun Valley Suite", type: "Hotel suite" },
  { id: "1GzCup4WYiF", title: "One-Bedroom Suite", type: "Hotel suite" },
  { id: "5hC8AHg7KNF", title: "102 Hardrock Ln", type: "Home" },
];
// =================================================

const thumb = (id) => `https://my.matterport.com/api/v2/player/models/${id}/thumb/`;
const embed = (id) => `https://my.matterport.com/show/?m=${id}&play=1&qs=1&brand=0`;

// ---- Portfolio grid ----
(function buildWork() {
  const grid = document.getElementById("work-grid");
  if (!grid) return;
  TOURS.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="work-card" type="button" data-model="${t.id}" data-title="${t.title}">
        <span class="work-thumb"><img src="${thumb(t.id)}" alt="Inside ${t.title}" loading="${i < 2 ? "eager" : "lazy"}" width="3034" height="1707"></span>
        <span class="work-meta"><strong>${t.title}</strong><span>${t.type}</span></span>
      </button>`;
    grid.appendChild(li);
  });
})();

// ---- Tour viewer (iframe loads only when opened, so the page stays fast) ----
(function tourViewer() {
  const dialog = document.getElementById("tour-dialog");
  const frame = document.getElementById("tour-dialog-frame");
  const title = document.getElementById("tour-dialog-title");
  const closeBtn = document.getElementById("tour-dialog-close");
  const cta = document.getElementById("tour-dialog-cta");
  let opener = null;

  function open(id, name, from) {
    opener = from;
    title.textContent = name;
    frame.innerHTML = `<iframe src="${embed(id)}" title="3D tour of ${name}" allow="fullscreen; xr-spatial-tracking" allowfullscreen></iframe>`;
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function close() {
    if (dialog.open) dialog.close();
  }
  dialog.addEventListener("close", () => {
    frame.innerHTML = "";
    document.body.style.overflow = "";
    if (opener) opener.focus();
  });
  closeBtn.addEventListener("click", close);
  cta.addEventListener("click", close);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".work-card");
    if (card) open(card.dataset.model, card.dataset.title, card);
  });

  // Hero: swap the photo for the live tour in place
  const stage = document.querySelector(".tour-stage");
  const play = stage && stage.querySelector(".tour-play");
  if (play) {
    play.addEventListener("click", () => {
      const id = stage.dataset.model;
      const iframe = document.createElement("iframe");
      iframe.src = embed(id);
      iframe.title = `3D tour of ${stage.dataset.title}`;
      iframe.allow = "fullscreen; xr-spatial-tracking";
      iframe.allowFullscreen = true;
      stage.appendChild(iframe);
      play.remove();
      iframe.focus();
    });
  }
})();

// ---- Pricing buttons pre-select the property type ----
document.querySelectorAll("[data-type]").forEach((a) => {
  a.addEventListener("click", () => {
    const sel = document.getElementById("q-type");
    if (sel) sel.value = a.dataset.type;
  });
});

// ---- Quote form ----
(function quoteForm() {
  const form = document.getElementById("quote-form");
  const status = document.getElementById("form-status");
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    let bad = null;
    [["name", name.length > 0], ["email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)]].forEach(([f, ok]) => {
      form[f].setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !bad) bad = form[f];
    });
    if (bad) { setStatus("Please add your name and a valid email so we can reply.", "error"); bad.focus(); return; }
    if (form.botcheck.checked) return;

    const data = {
      name, email,
      phone: form.phone.value.trim(),
      property_type: form.property_type.value,
      size_sqft: form.size.value.trim(),
      location: form.location.value.trim(),
      message: form.message.value.trim(),
    };

    if (!WEB3FORMS_KEY) {
      const body = Object.entries(data).map(([k, v]) => `${k.replace("_", " ")}: ${v || "-"}`).join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Quote request: " + data.property_type)}&body=${encodeURIComponent(body)}`;
      setStatus("Your email app should open with the request ready to send.");
      return;
    }

    btn.disabled = true;
    setStatus("Sending…");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New quote request: ${data.property_type}`,
          from_name: "Foster 3D Tours website",
          replyto: email,
          ...data,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset();
      setStatus("Thanks! We got your request and will reply within one business day.", "ok");
    } catch (err) {
      setStatus(`That didn't go through. Please email ${CONTACT_EMAIL} or call (208) 720-4772.`, "error");
    } finally {
      btn.disabled = false;
    }
  });
})();

document.getElementById("year").textContent = new Date().getFullYear();
