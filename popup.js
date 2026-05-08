// ── STATE ─────────────────────────────────────────────────────────────────
let states = {
  protanopia:    false,
  deuteranopia:  false,
  blueBlinds:    false,
  yellowBlinds:  false,
  achromatopsia: false,
  dyslexia:      false,
  // New features
  fontSize:      16,    // in px  (default 16)
  zoom:          100,   // in %   (default 100)
  imagesHidden:  false,
};

// ── STORAGE KEYS ──────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  PROTANOPIA:     "isProtanopia",
  DEUTERANOPIA:   "isDeuteranopia",
  BLUE_BLINDNESS: "isTritanopia",
  YELLOW_BLINDNESS:"isTritanomaly",
  ACHROMATOPSIA:  "isAchromatopsia",
  DYSLEXIA:       "isDyslexic",
  // New features
  FONT_SIZE:      "seFontSize",
  ZOOM:           "seZoom",
  IMAGES_HIDDEN:  "seImagesHidden",
};

// ── FONT SIZE CONFIG ───────────────────────────────────────────────────────
const FONT_MIN   = 10;   // px
const FONT_MAX   = 32;   // px
const FONT_STEP  = 2;    // px

// ── ZOOM CONFIG ────────────────────────────────────────────────────────────
const ZOOM_MIN   = 50;   // %
const ZOOM_MAX   = 200;  // %
const ZOOM_STEP  = 10;   // %

// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadSavedStates();

  // Colour-blindness toggles
  setupToggle("protanopia",      handleProtanopiaToggle);
  setupToggle("deuteranopia",    handleDeuteranopiaToggle);
  setupToggle("blue-blindness",  handleBlueBlindnessToggle);
  setupToggle("yellow-blindness",handleYellowBlindnessToggle);
  setupToggle("achromatopsia",   handleAchromatopsiaToggle);
  setupToggle("dyslexia",        handleDyslexiaToggle);

  // ── Font Size ────────────────────────────────────────────────
  document.getElementById("font-inc").addEventListener("click", () => {
    if (states.fontSize < FONT_MAX) {
      states.fontSize += FONT_STEP;
      applyFontSize();
    }
  });
  document.getElementById("font-dec").addEventListener("click", () => {
    if (states.fontSize > FONT_MIN) {
      states.fontSize -= FONT_STEP;
      applyFontSize();
    }
  });
  document.getElementById("font-reset").addEventListener("click", () => {
    states.fontSize = 16;
    applyFontSize();
  });

  // ── Zoom / Magnifier ─────────────────────────────────────────
  document.getElementById("zoom-inc").addEventListener("click", () => {
    if (states.zoom < ZOOM_MAX) {
      states.zoom += ZOOM_STEP;
      applyZoom();
    }
  });
  document.getElementById("zoom-dec").addEventListener("click", () => {
    if (states.zoom > ZOOM_MIN) {
      states.zoom -= ZOOM_STEP;
      applyZoom();
    }
  });
  document.getElementById("zoom-reset").addEventListener("click", () => {
    states.zoom = 100;
    applyZoom();
  });

  // ── Image Remover ────────────────────────────────────────────
  document.getElementById("btn-hide-images").addEventListener("click", () => {
    states.imagesHidden = true;
    applyImagesHidden();
  });
  document.getElementById("btn-show-images").addEventListener("click", () => {
    states.imagesHidden = false;
    applyImagesHidden();
  });
});

// ── LOAD SAVED STATES ──────────────────────────────────────────────────────
function loadSavedStates() {
  chrome.storage.sync.get(Object.values(STORAGE_KEYS), (result) => {
    // Colour toggles
    states.protanopia    = result[STORAGE_KEYS.PROTANOPIA]      || false;
    states.deuteranopia  = result[STORAGE_KEYS.DEUTERANOPIA]    || false;
    states.blueBlinds    = result[STORAGE_KEYS.BLUE_BLINDNESS]  || false;
    states.yellowBlinds  = result[STORAGE_KEYS.YELLOW_BLINDNESS]|| false;
    states.achromatopsia = result[STORAGE_KEYS.ACHROMATOPSIA]   || false;
    states.dyslexia      = result[STORAGE_KEYS.DYSLEXIA]        || false;

    updateToggleUI("protanopia",      states.protanopia);
    updateToggleUI("deuteranopia",    states.deuteranopia);
    updateToggleUI("blue-blindness",  states.blueBlinds);
    updateToggleUI("yellow-blindness",states.yellowBlinds);
    updateToggleUI("achromatopsia",   states.achromatopsia);
    updateToggleUI("dyslexia",        states.dyslexia);

    // Font Size
    if (result[STORAGE_KEYS.FONT_SIZE]) {
      const savedPx = parseInt(result[STORAGE_KEYS.FONT_SIZE]);
      if (!isNaN(savedPx)) states.fontSize = savedPx;
    }
    updateFontDisplay();

    // Zoom
    if (result[STORAGE_KEYS.ZOOM]) {
      const savedZoom = parseInt(result[STORAGE_KEYS.ZOOM]);
      if (!isNaN(savedZoom)) states.zoom = savedZoom;
    }
    updateZoomDisplay();

    // Images hidden
    states.imagesHidden = result[STORAGE_KEYS.IMAGES_HIDDEN] || false;
    updateImagesDisplay();
  });
}

// ── TOGGLE SETUP ───────────────────────────────────────────────────────────
function setupToggle(id, handler) {
  const checkbox = document.getElementById(id);
  if (checkbox) checkbox.addEventListener("change", handler);
}

// ── TOGGLE UI UPDATE ───────────────────────────────────────────────────────
function updateToggleUI(elementId, isEnabled) {
  const checkbox = document.getElementById(elementId);
  if (!checkbox) return;
  checkbox.checked = isEnabled;
}

// ── COLOUR-BLINDNESS HANDLERS ──────────────────────────────────────────────
function sendToActiveTab(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, msg);
  });
}

function handleProtanopiaToggle(event) {
  states.protanopia = event.target.checked;
  if (states.protanopia) {
    states.deuteranopia = states.blueBlinds = states.yellowBlinds = states.achromatopsia = false;
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "protanopia", isActive: states.protanopia });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]:    states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]:  states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]:states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]:states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleDeuteranopiaToggle(event) {
  states.deuteranopia = event.target.checked;
  if (states.deuteranopia) {
    states.protanopia = states.blueBlinds = states.yellowBlinds = states.achromatopsia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "deuteranopia", isActive: states.deuteranopia });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]:    states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]:  states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]:states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]:states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleBlueBlindnessToggle(event) {
  states.blueBlinds = event.target.checked;
  if (states.blueBlinds) {
    states.protanopia = states.deuteranopia = states.yellowBlinds = states.achromatopsia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "tritanopia", isActive: states.blueBlinds });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]:    states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]:  states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]:states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]:states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleYellowBlindnessToggle(event) {
  states.yellowBlinds = event.target.checked;
  if (states.yellowBlinds) {
    states.protanopia = states.deuteranopia = states.blueBlinds = states.achromatopsia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "tritanomaly", isActive: states.yellowBlinds });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]:    states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]:  states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]:states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]:states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleAchromatopsiaToggle(event) {
  states.achromatopsia = event.target.checked;
  if (states.achromatopsia) {
    states.protanopia = states.deuteranopia = states.blueBlinds = states.yellowBlinds = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
  }
  sendToActiveTab({ action: "achromatopsia", isActive: states.achromatopsia });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]:    states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]:  states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]:states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]:states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleDyslexiaToggle(event) {
  states.dyslexia = event.target.checked;
  sendToActiveTab({ action: "dyslexia", isDyslexic: states.dyslexia });
  chrome.storage.sync.set({ [STORAGE_KEYS.DYSLEXIA]: states.dyslexia });
}

// ── FONT SIZE ──────────────────────────────────────────────────────────────
function applyFontSize() {
  const sizeStr = states.fontSize + "px";
  updateFontDisplay();
  sendToActiveTab({ action: "fontSize", fontSize: sizeStr });
  chrome.storage.sync.set({ [STORAGE_KEYS.FONT_SIZE]: sizeStr });
}

function updateFontDisplay() {
  const el = document.getElementById("font-size-display");
  if (el) el.textContent = states.fontSize + "px";

  // Dim the − button when at min, + when at max
  const decBtn = document.getElementById("font-dec");
  const incBtn = document.getElementById("font-inc");
  if (decBtn) decBtn.style.opacity = states.fontSize <= FONT_MIN ? "0.35" : "1";
  if (incBtn) incBtn.style.opacity = states.fontSize >= FONT_MAX ? "0.35" : "1";
}

// ── ZOOM ───────────────────────────────────────────────────────────────────
function applyZoom() {
  const zoomStr = states.zoom + "%";
  updateZoomDisplay();
  sendToActiveTab({ action: "zoomPage", zoomValue: zoomStr });
  chrome.storage.sync.set({ [STORAGE_KEYS.ZOOM]: zoomStr });
}

function updateZoomDisplay() {
  const el = document.getElementById("zoom-display");
  if (el) el.textContent = states.zoom + "%";

  const decBtn = document.getElementById("zoom-dec");
  const incBtn = document.getElementById("zoom-inc");
  if (decBtn) decBtn.style.opacity = states.zoom <= ZOOM_MIN ? "0.35" : "1";
  if (incBtn) incBtn.style.opacity = states.zoom >= ZOOM_MAX ? "0.35" : "1";
}

// ── IMAGE REMOVER ──────────────────────────────────────────────────────────
function applyImagesHidden() {
  if (states.imagesHidden) {
    sendToActiveTab({ action: "image" });
  } else {
    sendToActiveTab({ action: "imageAdd" });
  }
  updateImagesDisplay();
  chrome.storage.sync.set({ [STORAGE_KEYS.IMAGES_HIDDEN]: states.imagesHidden });
}

function updateImagesDisplay() {
  const statusEl = document.getElementById("img-status");
  if (!statusEl) return;
  if (states.imagesHidden) {
    statusEl.textContent = "Hidden";
    statusEl.classList.add("hidden-state");
  } else {
    statusEl.textContent = "Visible";
    statusEl.classList.remove("hidden-state");
  }
}
