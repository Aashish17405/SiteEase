const originalStyles = new Map();
let isFilterApplied = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received request:", request);

  if (request.action === "dyslexia") {
    if (request.isDyslexic && !isFilterApplied) {
      applyColorFilter("dyslexia");
    } else if (!request.isDyslexic && isFilterApplied) {
      removeColorFilter();
    }

    chrome.storage.sync.set({ isDyslexic: request.isDyslexic }, () => {
      console.log(`Saved isDyslexic state: ${request.isDyslexic}`);
    });
  } else if (request.action === "protanopia") {
    if (request.isActive && !isFilterApplied) {
      applyColorFilter("protanopia");
    } else if (!request.isActive && isFilterApplied) {
      removeColorFilter();
    }
    chrome.storage.sync.set({ isProtanopia: request.isActive }, () => {
      console.log(`Saved isProtanopia state: ${request.isActive}`);
    });
  } else if (request.action === "deuteranopia") {
    if (request.isActive && !isFilterApplied) {
      applyColorFilter("deuteranopia");
    } else if (!request.isActive && isFilterApplied) {
      removeColorFilter();
    }
    chrome.storage.sync.set({ isDeuteranopia: request.isActive }, () => {
      console.log(`Saved isDeuteranopia state: ${request.isActive}`);
    });
  } else if (request.action === "tritanopia") {
    if (request.isActive && !isFilterApplied) {
      applyColorFilter("tritanopia");
    } else if (!request.isActive && isFilterApplied) {
      removeColorFilter();
    }
    chrome.storage.sync.set({ isTritanopia: request.isActive }, () => {
      console.log(`Saved isTritanopia state: ${request.isActive}`);
    });
  } else if (request.action === "achromatopsia") {
    if (request.isActive && !isFilterApplied) {
      applyColorFilter("achromatopsia");
    } else if (!request.isActive && isFilterApplied) {
      removeColorFilter();
    }
    chrome.storage.sync.set({ isAchromatopsia: request.isActive }, () => {
      console.log(`Saved isAchromatopsia state: ${request.isActive}`);
    });
  }
});

// Load saved states from storage
chrome.storage.sync.get(
  ["isDyslexic", "isProtanopia", "isDeuteranopia", "isTritanopia", "isAchromatopsia"], 
  (result) => {
    console.log("Loading saved filter states...", result);
    
    if (result.isDyslexic) {
      console.log("Applying saved Dyslexic state...");
      applyColorFilter("dyslexia");
    } else if (result.isProtanopia) {
      console.log("Applying saved Protanopia state...");
      applyColorFilter("protanopia");
    } else if (result.isDeuteranopia) {
      console.log("Applying saved Deuteranopia state...");
      applyColorFilter("deuteranopia");
    } else if (result.isTritanopia) {
      console.log("Applying saved Tritanopia state...");
      applyColorFilter("tritanopia");
    } else if (result.isAchromatopsia) {
      console.log("Applying saved Achromatopsia state...");
      applyColorFilter("achromatopsia");
    }
});

function applyColorFilter(type) {
  const filters = {
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
    `
  };

  // Create and inject the filter style
  const styleId = "colorblind-filter";
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  // Apply the filter to the entire HTML document
  styleElement.textContent = type === "dyslexia"
    ? `
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/fonts/OpenDyslexic-Regular.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
      }
      html {
        filter: ${filters[type]} !important;
        -webkit-filter: ${filters[type]} !important;
      }
      body, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, input, textarea {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
      }
    `
    : `
      html {
        filter: ${filters[type]} !important;
        -webkit-filter: ${filters[type]} !important;
      }
    `;

  isFilterApplied = true;
  console.log(`Applied ${type} filter`);
}

function removeColorFilter() {
  const styleElement = document.getElementById("colorblind-filter");
  if (styleElement) {
    styleElement.remove();
  }
  isFilterApplied = false;
  console.log("Removed color filter");
}
