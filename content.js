const originalStyles = new Map();
let isColorFilterApplied = false;
let isDyslexiaApplied = false;
let currentColorFilter = null;

// ── NEW FEATURE STATE ──────────────────────────────────
let currentFontSize = null;   // e.g. "18px"
let currentZoom    = null;   // e.g. "120%"
let imagesHidden   = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log("Received request:", request);

  if (request.action === "dyslexia") {
    if (request.isDyslexic) {
      applyDyslexiaFilter();
    } else {
      removeDyslexiaFilter();
    }

    chrome.storage.sync.set({ isDyslexic: request.isDyslexic });
  } else if (request.action === "protanopia") {
    // Only remove color filters, not dyslexia
    if (isColorFilterApplied) {
      removeColorFilter();
    }
    if (request.isActive) {
      applyColorFilter("protanopia");
    }

    chrome.storage.sync.set({ isProtanopia: request.isActive });
  } else if (request.action === "deuteranopia") {
    if (isColorFilterApplied) {
      removeColorFilter();
    }
    if (request.isActive) {
      applyColorFilter("deuteranopia");
    }

    chrome.storage.sync.set({ isDeuteranopia: request.isActive });
  } else if (request.action === "tritanopia") {
    if (isColorFilterApplied) {
      removeColorFilter();
    }
    if (request.isActive) {
      applyColorFilter("tritanopia");
    }

    chrome.storage.sync.set({ isTritanopia: request.isActive });
  } else if (request.action === "tritanomaly") {
    if (isColorFilterApplied) {
      removeColorFilter();
    }
    if (request.isActive) {
      applyColorFilter("tritanomaly");
    }

    chrome.storage.sync.set({ isTritanomaly: request.isActive });
  } else if (request.action === "achromatopsia") {
    if (isColorFilterApplied) {
      removeColorFilter();
    }
    if (request.isActive) {
      applyColorFilter("achromatopsia");
    }

    chrome.storage.sync.set({ isAchromatopsia: request.isActive });

  // ── FONT SIZE ──────────────────────────────────────────
  } else if (request.action === "fontSize") {
    applyFontSize(request.fontSize);
    chrome.storage.sync.set({ seFontSize: request.fontSize });

  // ── PAGE MAGNIFIER / ZOOM ──────────────────────────────
  } else if (request.action === "zoomPage") {
    const zoom = request.zoomValue;
    document.body.style.zoom = zoom;
    currentZoom = zoom;
    chrome.storage.sync.set({ seZoom: zoom });

  // ── IMAGE HIDE ──────────────────────────────────────────
  } else if (request.action === "image") {
    document.querySelectorAll("img").forEach(img => {
      img.style.setProperty("display", "none", "important");
    });
    imagesHidden = true;
    chrome.storage.sync.set({ seImagesHidden: true });

  // ── IMAGE SHOW ──────────────────────────────────────────
  } else if (request.action === "imageAdd") {
    document.querySelectorAll("img").forEach(img => {
      img.style.removeProperty("display");
    });
    imagesHidden = false;
    chrome.storage.sync.set({ seImagesHidden: false });
  }
});

// Load saved states from storage
chrome.storage.sync.get(
  [
    "isDyslexic",
    "isProtanopia",
    "isDeuteranopia",
    "isTritanopia",
    "isTritanomaly",
    "isAchromatopsia",
    "seFontSize",
    "seZoom",
    "seImagesHidden",
  ],
  (result) => {
    // Apply dyslexia filter if enabled
    if (result.isDyslexic) {
      applyDyslexiaFilter();
    }

    if (result.isProtanopia) {
      applyColorFilter("protanopia");
    } else if (result.isDeuteranopia) {
      applyColorFilter("deuteranopia");
    } else if (result.isTritanopia) {
      applyColorFilter("tritanopia");
    } else if (result.isTritanomaly) {
      applyColorFilter("tritanomaly");
    } else if (result.isAchromatopsia) {
      applyColorFilter("achromatopsia");
    }

    // ── Restore font size ──────────────────────────────
    if (result.seFontSize && result.seFontSize !== "16px") {
      applyFontSize(result.seFontSize);
    }

    // ── Restore zoom ───────────────────────────────────
    if (result.seZoom && result.seZoom !== "100%") {
      document.body.style.zoom = result.seZoom;
      currentZoom = result.seZoom;
    }

    // ── Restore images hidden ──────────────────────────
    if (result.seImagesHidden) {
      document.querySelectorAll("img").forEach(img => {
        img.style.setProperty("display", "none", "important");
      });
      imagesHidden = true;
    }
  }
);

// Color filters for different types of color blindness
const colorFilters = {
  protanopia: `
    contrast(1.1)
    saturate(1.5)
    hue-rotate(20deg)
    brightness(1.1)
  `,
  deuteranopia: `
    contrast(1.1)
    saturate(1.5)
    hue-rotate(-20deg)
    brightness(1.1)
  `,
  tritanopia: `
    contrast(1.2)
    saturate(1.3)
    hue-rotate(60deg)
    brightness(1.1)
  `,
  tritanomaly: `
    contrast(1.15)
    saturate(1.2)
    hue-rotate(30deg)
    brightness(1.05)
  `,
  achromatopsia: `
    grayscale(1)
    contrast(2)
    brightness(0.9)
    invert(0.1)
  `,
  dyslexia: `
    contrast(1.2)
    brightness(1.1)
    sepia(0.2)
  `,
};

function applyColorFilter(type) {
  // Create and inject the color filter style
  const styleId = "colorblind-filter";
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = `
    html {
      filter: ${colorFilters[type]} !important;
      -webkit-filter: ${colorFilters[type]} !important;
    }
  `;

  isColorFilterApplied = true;
  currentColorFilter = type;
  // console.log(`Applied ${type} color filter`);
}

function removeColorFilter() {
  const styleId = "colorblind-filter";
  let styleElement = document.getElementById(styleId);
  if (styleElement) {
    styleElement.parentNode.removeChild(styleElement);
  }
  isColorFilterApplied = false;
  currentColorFilter = null;
  // console.log("Removed color filter");
}

function applyDyslexiaFilter() {
  // Create and inject the dyslexia style
  const styleId = "dyslexia-filter";
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  const fontUrl = chrome.runtime.getURL("fonts/OpenDyslexic-Regular.woff");

  styleElement.textContent = `
    @font-face {
      font-family: 'OpenDyslexic';
      src: url('${fontUrl}') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    body, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, input, textarea {
      font-family: 'OpenDyslexic', Arial, sans-serif !important;
    }
  `;

  isDyslexiaApplied = true;
  // console.log("Applied dyslexia filter");
}

function removeDyslexiaFilter() {
  const styleId = "dyslexia-filter";
  let styleElement = document.getElementById(styleId);
  if (styleElement) {
    styleElement.parentNode.removeChild(styleElement);
  }
  isDyslexiaApplied = false;
  // console.log("Removed dyslexia filter");
}

function applyFontSize(size) {
  let styleId = "siteease-font-size-filter";
  let styleEl = document.getElementById(styleId);

  // If size is 16px, we consider it "reset" to avoid overriding default site styles
  if (size === "16px") {
    if (styleEl) styleEl.parentNode.removeChild(styleEl);
    currentFontSize = null;
    return;
  }

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  
  styleEl.textContent = `
    html, body, p, a, span, div, li, td, th, input, textarea, button {
      font-size: ${size} !important;
      line-height: 1.5 !important;
    }
    h1 { font-size: calc(${size} * 2.0) !important; line-height: 1.2 !important; }
    h2 { font-size: calc(${size} * 1.75) !important; line-height: 1.2 !important; }
    h3 { font-size: calc(${size} * 1.5) !important; line-height: 1.2 !important; }
    h4 { font-size: calc(${size} * 1.25) !important; line-height: 1.2 !important; }
    h5, h6 { font-size: calc(${size} * 1.1) !important; line-height: 1.2 !important; }
  `;
  currentFontSize = size;
}
