const originalStyles = new Map();
const dyslexicFontURL =
  "https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.min.css";
let dyslexicFontApplied = false;
let isAchromatopsicStyleApplied = false;
let isRedApplied = false;
let isBlueApplied = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const elements = document.body.getElementsByTagName("*");
  console.log("Current state:", {
    isDyslexic: request.isDyslexic,
    dyslexicFontApplied,
  });
  console.log("Current state:", {
    isAchromatopsic: request.isAchromatopsic,
    isAchromatopsicStyleApplied,
  });

  if (request.action === "orange-turquoise") {
    if (request.isRed && !isRedApplied) {
      console.log("Applying Orange Turquoise style...");
      applyRedGreenStyle(elements, true);
    } else if (!request.isRed && isRedApplied) {
      console.log("Removing Orange Turquoise style...");
      removeRedGreenStyle(elements);
    }

    chrome.storage.sync.set({ isRed: request.isRed }, () => {
      console.log(`Saved isARed state: ${request.isRed}`);
    });
  } else if (request.action === "cyan-beige") {
    if (request.isBlue && !isBlueApplied) {
      console.log("Applying Cyan Beige style...");
      applyYellowBlueStyle(elements, request.isBlue);
    } else if (!request.isBlue && isBlueApplied) {
      console.log("Removing Cyan Beige style...");
      removeYellowBlueStyle(elements);
    }

    chrome.storage.sync.set({ isBlue: request.isBlue }, () => {
      console.log(`Saved isBlue state: ${request.isBlue}`);
    });
  } else if (request.action === "achromatopsia") {
    if (request.isAchromatopsic && !isAchromatopsicStyleApplied) {
      console.log("Applying Achromatopsia style...");
      applyAchromatopsicStyle(elements, request.isAchromatopsic);
    } else if (!request.isAchromatopsic && isAchromatopsicStyleApplied) {
      console.log("Removing Achromatopsia style...");
      removeAchromatopsicStyle(elements);
    }

    chrome.storage.sync.set(
      { isAchromatopsic: request.isAchromatopsic },
      () => {
        console.log(`Saved isAchromatopsic state: ${request.isAchromatopsic}`);
      }
    );
  } else if (request.action === "dyslexia") {
    if (request.isDyslexic && !dyslexicFontApplied) {
      console.log("Applying OpenDyslexic font...");
      applyDyslexicFont();
    } else if (!request.isDyslexic && dyslexicFontApplied) {
      console.log("Removing OpenDyslexic font...");
      removeDyslexicFont();
    }

    chrome.storage.sync.set({ isDyslexic: request.isDyslexic }, () => {
      console.log(`Saved isDyslexic state: ${request.isDyslexic}`);
    });
  }
});

chrome.storage.sync.get(["isRed"], (result) => {
  const isRed = result.isRed || false;
  if (isRed) {
    console.log("Applying saved Orange turquoise style...");
    applyRedGreenStyle(document.body.getElementsByTagName("*"), isRed);
  }
});

function applyRedGreenStyle(elements, isActive) {
  isRedApplied = isActive;
  for (let element of elements) {
    if (!(element instanceof Element)) continue;
    if (element.tagName === "SCRIPT" || element.tagName === "STYLE") continue;

    if (!originalStyles.has(element)) {
      originalStyles.set(element, {
        color: window.getComputedStyle(element).color,
      });
    }

    if (isActive) {
      const color = window.getComputedStyle(element).color;
      const rgb = color.match(/\d+/g);

      if (rgb) {
        let [r, g, b] = rgb.map(Number);
        element.style.color =
          r > g && r > b
            ? "#FFA500"
            : g > r && g > b
            ? "#40E0D0"
            : originalStyles.get(element).color;
      }
    }
  }
}

function removeRedGreenStyle(elements) {
  for (let element of elements) {
    if (!(element instanceof Element)) continue;

    const originalStyle = originalStyles.get(element);
    if (originalStyle) {
      element.style.color = originalStyle.color || "";
    }
  }
  originalStyles.clear();
  isRedApplied = false;
}

chrome.storage.sync.get(["isBlue"], (result) => {
  const isBlue = result.isBlue || false;
  if (isBlue) {
    console.log("Applying saved Cyan Beige style...");
    applyYellowBlueStyle(document.body.getElementsByTagName("*"), isBlue);
  }
});

function applyYellowBlueStyle(elements, isActive) {
  isBlueApplied = true;
  for (let element of elements) {
    if (!(element instanceof Element)) continue;
    if (element.tagName === "SCRIPT" || element.tagName === "STYLE") continue;

    if (!originalStyles.has(element)) {
      originalStyles.set(element, {
        color: window.getComputedStyle(element).color,
      });
    }
    if (isActive) {
      const color = window.getComputedStyle(element).color;
      const rgb = color.match(/\d+/g);

      if (rgb) {
        let [r, g, b] = rgb.map(Number);
        element.style.color =
          b > r && b > g
            ? "#00ffff"
            : r > g && g > b
            ? "#F5F5DC"
            : originalStyles.get(element).color;
      }
    }
  }
}

function removeYellowBlueStyle(elements) {
  for (let element of elements) {
    if (!(element instanceof Element)) continue;
    if (!originalStyles.has(element)) {
      originalStyles.set(element, {
        filter: window.getComputedStyle(element).filter,
      });
    }
    element.style.color = originalStyles.get(element).color || "";
  }
  originalStyles.clear();
  isBlueApplied = false;
}

chrome.storage.sync.get(["isAchromatopsic"], (result) => {
  const isAchromatopsic = result.isAchromatopsic || false;
  if (isAchromatopsic) {
    console.log("Applying saved Achromatopsia style...");
    applyAchromatopsicStyle(
      document.body.getElementsByTagName("*"),
      isAchromatopsic
    );
  }
});

function applyAchromatopsicStyle(elements, isActive) {
  for (let element of elements) {
    if (!(element instanceof Element)) continue;
    if (element.tagName === "SCRIPT" || element.tagName === "STYLE") continue;

    if (!originalStyles.has(element)) {
      originalStyles.set(element, {
        filter: window.getComputedStyle(element).filter,
      });
    }
    if (isActive) {
      element.style.filter = "grayscale(100%) contrast(150%)";
      isAchromatopsicStyleApplied = true;
    }
  }
}

function removeAchromatopsicStyle(elements) {
  for (let element of elements) {
    if (!(element instanceof Element)) continue;
    if (!originalStyles.has(element)) {
      originalStyles.set(element, {
        filter: window.getComputedStyle(element).filter,
      });
    }
    element.style.filter = originalStyles.get(element).filter || "";
    isAchromatopsicStyleApplied = false;
  }
}

chrome.storage.sync.get(["isDyslexic"], (result) => {
  if (result.isDyslexic) {
    console.log("Applying saved Dyslexic font state...");
    applyDyslexicFont();
  }
});

async function applyDyslexicFont() {
  try {
    // Get the background color of the body and compute its brightness
    const getBackgroundColor = (element) => {
      const bgcolor = window.getComputedStyle(element).backgroundColor;
      if (bgcolor === "rgba(0, 0, 0, 0)" || bgcolor === "transparent") {
        return element.parentElement
          ? getBackgroundColor(element.parentElement)
          : "#ffffff";
      }
      return bgcolor;
    };

    const backgroundColor = getBackgroundColor(document.body);
    const textColor = window.getComputedStyle(document.body).color;

    // Convert RGB to HSL and determine brightness
    const rgb2hsl = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, l * 100];
    };

    const rgbValues = backgroundColor.match(/\d+/g).map(Number);
    const [hue, saturation, lightness] = rgb2hsl(...rgbValues);

    // Determine if the background is light or dark
    const isLightBackground = lightness > 50;

    // Define color schemes with better contrast
    const lightSchemes = [
      { bg: "#fff6e6", text: "#2d2d2d" }, // Cream with dark gray
      { bg: "#f5f5ff", text: "#1a1a1a" }, // Light blue-white with black
      { bg: "#fff0eb", text: "#2d1f1f" }, // Soft peach with dark brown
    ];

    const darkSchemes = [
      { bg: "#1f1f2e", text: "#ffffff" }, // Dark blue-gray with white
      { bg: "#2d2d2d", text: "#f0f0f0" }, // Dark gray with off-white
      { bg: "#1f2d1f", text: "#ffffff" }, // Dark green with white
    ];

    // Choose scheme based on current background
    const scheme = isLightBackground ? lightSchemes[0] : darkSchemes[0];

    const dyslexicFontCSS = `
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/fonts/OpenDyslexic-Regular.woff2') format('woff2'),
             url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/fonts/OpenDyslexic-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      /* Base text styling */
      body, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, input, textarea {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
        background-color: ${scheme.bg} !important;
        color: ${scheme.text} !important;
        line-height: 1.8 !important;
        text-align: left !important;
        letter-spacing: 0.12em !important;
        word-spacing: 0.16em !important;
      }

      /* Links with appropriate contrast */
      a {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
        color: ${isLightBackground ? "#0052cc" : "#99ddff"} !important;
        text-decoration: underline !important;
      }

      /* Code blocks and quotes */
      pre, code, blockquote {
        font-family: 'OpenDyslexic', monospace !important;
        background-color: ${
          isLightBackground ? scheme.bg : "rgba(255, 255, 255, 0.1)"
        } !important;
        color: ${scheme.text} !important;
        padding: 1em !important;
        border-left: 4px solid ${
          isLightBackground ? "#666666" : "#cccccc"
        } !important;
      }

      /* Form elements */
      input, textarea, select {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
        background-color: ${
          isLightBackground ? "#ffffff" : "#333333"
        } !important;
        color: ${isLightBackground ? "#000000" : "#ffffff"} !important;
        border: 2px solid ${
          isLightBackground ? "#666666" : "#999999"
        } !important;
      }

      /* Tables */
      th, td {
        font-family: 'OpenDyslexic', Arial, sans-serif !important;
        background-color: ${scheme.bg} !important;
        color: ${scheme.text} !important;
        border: 1px solid ${
          isLightBackground ? "#666666" : "#999999"
        } !important;
      }

      /* Ensure contrast for selection */
      ::selection {
        background-color: ${
          isLightBackground ? "#0052cc" : "#99ddff"
        } !important;
        color: ${isLightBackground ? "#ffffff" : "#000000"} !important;
      }
    `;

    injectCssInline("dyslexicFontStylesheet", dyslexicFontCSS);
    dyslexicFontApplied = true;
    console.log("Dyslexic styling applied successfully");
  } catch (error) {
    console.error("Detailed error loading dyslexic styles:", error);
    console.error("Error stack:", error.stack);
  }
}

function injectCssInline(id, style) {
  if (document.getElementById(id)) return;

  const head = document.head || document.getElementsByTagName("head")[0];
  const sheet = document.createElement("style");
  sheet.setAttribute("id", id);
  sheet.appendChild(document.createTextNode(style));
  head.appendChild(sheet);
}

function removeDyslexicFont() {
  const styleElement = document.getElementById("dyslexicFontStylesheet");
  if (styleElement) {
    styleElement.remove();
    dyslexicFontApplied = false;
  }
}
