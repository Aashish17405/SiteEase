const originalStyles = new Map();
let isColorFilterApplied = false;
let isDyslexiaApplied = false;
let currentColorFilter = null;

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
  ],
  (result) => {
    // console.log("Loading saved filter states...", result);

    // Apply dyslexia filter if enabled
    if (result.isDyslexic) {
      // console.log("Applying saved Dyslexic state...");
      applyDyslexiaFilter();
    }

    if (result.isProtanopia) {
      // console.log("Applying saved Protanopia state...");
      applyColorFilter("protanopia");
    } else if (result.isDeuteranopia) {
      // console.log("Applying saved Deuteranopia state...");
      applyColorFilter("deuteranopia");
    } else if (result.isTritanopia) {
      // console.log("Applying saved Tritanopia state...");
      applyColorFilter("tritanopia");
    } else if (result.isTritanomaly) {
      // console.log("Applying saved Tritanomaly state...");
      applyColorFilter("tritanomaly");
    } else if (result.isAchromatopsia) {
      // console.log("Applying saved Achromatopsia state...");
      applyColorFilter("achromatopsia");
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
