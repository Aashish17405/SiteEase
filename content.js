const originalStyles = new Map();
const dyslexicFontURL =
  "https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.min.css";
let dyslexicFontApplied = false;
let isAchromatopsicStyleApplied = false;
let isRedApplied = false;
let isGreenApplied = false;

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
    if (request.isBlue && !isGreenApplied) {
      console.log("Applying Cyan Beige style...");
      applyYellowBlueStyle(elements, request.isBlue);
    } else if (!request.isBlue && isGreenApplied) {
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
  } else if (request.action === "protanopia") {
    if (request.isActive && !isRedApplied) {
      console.log("Applying Protanopia style...");
      applyProtanopiaStyle(elements);
    } else if (!request.isActive && isRedApplied) {
      console.log("Removing Protanopia style...");
      removeProtanopiaStyle(elements);
    }
  } else if (request.action === "deuteranopia") {
    if (request.isActive && !isGreenApplied) {
      console.log("Applying Deuteranopia style...");
      applyDeuteranopiaStyle(elements);
    } else if (!request.isActive && isGreenApplied) {
      console.log("Removing Deuteranopia style...");
      removeDeuteranopiaStyle(elements);
    }
  } else if (request.action === "tritanopia") {
    if (request.isActive) {
      console.log("Applying Tritanopia style...");
      applyTritanopiaStyle(elements);
    } else {
      console.log("Removing Tritanopia style...");
      restoreOriginalStyles(elements);
    }
  } else if (request.action === "tritanomaly") {
    if (request.isActive) {
      console.log("Applying Tritanomaly style...");
      applyTritanopiaStyle(elements, true);
    } else {
      console.log("Removing Tritanomaly style...");
      restoreOriginalStyles(elements);
    }
  }
});

chrome.storage.sync.get(["isRed"], (result) => {
  const isRed = result.isRed || false;
  if (isRed) {
    console.log("Applying saved Orange turquoise style...");
    applyRedGreenStyle(document.body.getElementsByTagName("*"), isRed);
  }
});

function applyRedGreenStyle(elements, isActive, type = "deuteranopia") {
  isRedApplied = isActive;

  // Color mapping for different types of color blindness with improved contrast
  const colorMaps = {
    deuteranopia: {
      // Green deficiency
      red: "#FF9934", // Bright orange
      green: "#00B7EB", // Deep sky blue
      lightGreen: "#80FFFF", // Light cyan
      darkGreen: "#0099CC", // Dark cyan
      yellow: "#FFDC00", // Bright yellow
      brown: "#8B4513", // Saddle brown
      background: {
        dark: "#1f1f2e", // Dark blue-gray
        light: "#fff6e6", // Light cream
      },
    },
    protanopia: {
      // Red deficiency
      red: "#FFB347", // Pastel orange
      green: "#00CED1", // Dark turquoise
      lightGreen: "#B2FFFF", // Light turquoise
      darkGreen: "#008B8B", // Dark cyan
      yellow: "#F0E68C", // Khaki
      brown: "#A0522D", // Sienna
      background: {
        dark: "#2d2d2d", // Dark gray
        light: "#f5f5ff", // Light blue-white
      },
    },
  };

  const colorMap = colorMaps[type];

  for (let element of elements) {
    if (!(element instanceof Element)) continue;
    if (element.tagName === "SCRIPT" || element.tagName === "STYLE") continue;

    // Store original styles
    if (!originalStyles.has(element)) {
      const computedStyle = window.getComputedStyle(element);
      originalStyles.set(element, {
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        borderColor: computedStyle.borderColor,
        fill: computedStyle.fill,
        stroke: computedStyle.stroke,
      });
    }

    if (isActive) {
      const computedStyle = window.getComputedStyle(element);

      // Helper function to determine color type and background type
      const getColorInfo = (r, g, b) => {
        const total = r + g + b;
        const threshold = 0.4;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const isDark = brightness < 128;

        // Color type detection
        let colorType = null;
        if (g / total > threshold && r < 200 && b < 200) {
          colorType = g > 200 ? "lightGreen" : "darkGreen";
        } else if (r > g && r > b) {
          colorType = "red";
        } else if (r > 200 && g > 200 && b < 100) {
          colorType = "yellow";
        } else if (g > r && g > b) {
          colorType = "green";
        }

        return {
          colorType,
          isDark,
        };
      };

      // Handle text color
      const textColor = computedStyle.color;
      const textRGB = textColor.match(/\d+/g);
      if (textRGB) {
        let [r, g, b] = textRGB.map(Number);
        const { colorType } = getColorInfo(r, g, b);
        if (colorType) {
          // Ensure text is visible against background
          const bgColor = computedStyle.backgroundColor;
          const bgRGB = bgColor.match(/\d+/g);
          if (bgRGB) {
            const { isDark } = getColorInfo(...bgRGB.map(Number));
            element.style.color = isDark ? "#ffffff" : colorMap[colorType];
          }
        }
      }

      // Handle background color
      const bgColor = computedStyle.backgroundColor;
      const bgRGB = bgColor.match(/\d+/g);
      if (bgRGB && bgRGB.length >= 3) {
        let [r, g, b] = bgRGB.map(Number);
        const alpha = bgRGB[3] ? Number(bgRGB[3]) : 1;

        if (alpha > 0.1) {
          const { colorType, isDark } = getColorInfo(r, g, b);
          // Keep dark backgrounds dark, light backgrounds light
          element.style.backgroundColor = isDark
            ? colorMap.background.dark
            : colorMap.background.light;
        }
      }

      // Handle border color
      const borderColor = computedStyle.borderColor;
      const borderRGB = borderColor.match(/\d+/g);
      if (borderRGB) {
        let [r, g, b] = borderRGB.map(Number);
        const { colorType, isDark } = getColorInfo(r, g, b);
        if (colorType) {
          element.style.borderColor = isDark ? "#ffffff" : colorMap[colorType];
        }
      }

      // Handle SVG elements
      if (element instanceof SVGElement) {
        const fill = computedStyle.fill;
        const fillRGB = fill.match(/\d+/g);
        if (fillRGB) {
          let [r, g, b] = fillRGB.map(Number);
          const { colorType, isDark } = getColorInfo(r, g, b);
          if (colorType) {
            element.style.fill = isDark ? "#ffffff" : colorMap[colorType];
          }
        }

        const stroke = computedStyle.stroke;
        const strokeRGB = stroke.match(/\d+/g);
        if (strokeRGB) {
          let [r, g, b] = strokeRGB.map(Number);
          const { colorType, isDark } = getColorInfo(r, g, b);
          if (colorType) {
            element.style.stroke = isDark ? "#ffffff" : colorMap[colorType];
          }
        }
      }
    }
  }
}

function removeRedGreenStyle(elements) {
  for (let element of elements) {
    if (!(element instanceof Element)) continue;

    const originalStyle = originalStyles.get(element);
    if (originalStyle) {
      // Restore all original colors
      element.style.color = originalStyle.color || "";
      element.style.backgroundColor = originalStyle.backgroundColor || "";
      element.style.borderColor = originalStyle.borderColor || "";

      // Restore SVG properties if they exist
      if (element instanceof SVGElement) {
        element.style.fill = originalStyle.fill || "";
        element.style.stroke = originalStyle.stroke || "";
      }
    }
  }
  // Clear the stored original styles
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
  isGreenApplied = true;
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
  isGreenApplied = false;
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

function applyProtanopiaStyle(elements) {
  isRedApplied = true;

  const protanopiaColors = {
    // Enhanced colors for red-blind users
    red: "#0077BB", // Blue (replaces red)
    green: "#00AF5B", // Bright green (enhanced visibility)
    yellow: "#FFDC00", // Bright yellow
    blue: "#00B7EB", // Cyan blue
    purple: "#9933FF", // Bright purple
    orange: "#FFB347", // Light orange
    brown: "#8B4513", // Saddle brown
    // Background colors
    lightBg: "#F0F8FF", // Light blue tint
    darkBg: "#1A1A2E", // Dark blue-tinted background
  };

  for (let element of elements) {
    if (
      !(element instanceof Element) ||
      element.tagName.match(/^(SCRIPT|STYLE)$/)
    )
      continue;

    storeOriginalStyles(element);
    const computedStyle = window.getComputedStyle(element);

    // Enhanced color conversion for protanopia
    const convertColorForProtanopia = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return color;

      const [r, g, b] = rgb.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const isDark = brightness < 128;

      // Enhanced color mapping
      if (r > g && r > b) {
        // Red dominant
        return isDark ? protanopiaColors.blue : protanopiaColors.yellow;
      } else if (g > r && g > b) {
        // Green dominant
        return isDark ? protanopiaColors.green : protanopiaColors.lightBg;
      } else if (b > r && b > g) {
        // Blue dominant
        return protanopiaColors.blue;
      }

      // Handle grays and mixed colors
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
        return isDark ? "#D8D8D8" : "#2A2A2A";
      }

      return color;
    };

    applyColorConversion(element, computedStyle, convertColorForProtanopia);
  }
}

function applyDeuteranopiaStyle(elements) {
  isGreenApplied = true;

  const deuteranopiaColors = {
    // Enhanced colors for green-blind users
    red: "#FF5555", // Bright red
    green: "#4169E1", // Royal blue (replaces green)
    yellow: "#FFD700", // Gold
    blue: "#00CED1", // Dark turquoise
    purple: "#FF69B4", // Hot pink
    orange: "#FF8C00", // Dark orange
    brown: "#A0522D", // Sienna
    // Background colors
    lightBg: "#FFF5E6", // Warm light background
    darkBg: "#2D2D3D", // Dark warm background
  };

  for (let element of elements) {
    if (
      !(element instanceof Element) ||
      element.tagName.match(/^(SCRIPT|STYLE)$/)
    )
      continue;

    storeOriginalStyles(element);
    const computedStyle = window.getComputedStyle(element);

    // Enhanced color conversion for deuteranopia
    const convertColorForDeuteranopia = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return color;

      const [r, g, b] = rgb.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const isDark = brightness < 128;

      // Enhanced color mapping
      if (g > r && g > b) {
        // Green dominant
        return isDark ? deuteranopiaColors.blue : deuteranopiaColors.yellow;
      } else if (r > g && r > b) {
        // Red dominant
        return isDark ? deuteranopiaColors.red : deuteranopiaColors.orange;
      } else if (b > r && b > g) {
        // Blue dominant
        return deuteranopiaColors.blue;
      }

      // Handle grays and mixed colors
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
        return isDark ? "#E0E0E0" : "#202020";
      }

      return color;
    };

    applyColorConversion(element, computedStyle, convertColorForDeuteranopia);
  }
}

function applyTritanopiaStyle(elements) {
  const tritanopiaColors = {
    // Enhanced colors for blue-blind users
    red: "#FF4D4D", // Bright red
    green: "#00CC66", // Bright green
    yellow: "#FFB800", // Golden yellow
    blue: "#FF69B4", // Pink (replaces blue)
    purple: "#FF1493", // Deep pink
    orange: "#FF8C00", // Dark orange
    brown: "#8B4513", // Saddle brown
    // Background colors
    lightBg: "#FFF0F5", // Lavender blush
    darkBg: "#2A1F2D", // Dark purple-tinted background
  };

  for (let element of elements) {
    if (
      !(element instanceof Element) ||
      element.tagName.match(/^(SCRIPT|STYLE)$/)
    )
      continue;

    storeOriginalStyles(element);
    const computedStyle = window.getComputedStyle(element);

    // Enhanced color conversion for tritanopia
    const convertColorForTritanopia = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return color;

      const [r, g, b] = rgb.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const isDark = brightness < 128;

      // Enhanced color mapping
      if (b > r && b > g) {
        // Blue dominant
        return isDark ? tritanopiaColors.purple : tritanopiaColors.red;
      } else if (g > r && g > b) {
        // Green dominant
        return isDark ? tritanopiaColors.green : tritanopiaColors.yellow;
      } else if (r > g && r > b) {
        // Red dominant
        return tritanopiaColors.red;
      }

      // Handle grays and mixed colors
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
        return isDark ? "#E6E6E6" : "#1A1A1A";
      }

      return color;
    };

    applyColorConversion(element, computedStyle, convertColorForTritanopia);
  }
}

// Helper function to store original styles
function storeOriginalStyles(element) {
  if (!originalStyles.has(element)) {
    const computedStyle = window.getComputedStyle(element);
    originalStyles.set(element, {
      color: computedStyle.color,
      backgroundColor: computedStyle.backgroundColor,
      borderColor: computedStyle.borderColor,
      fill: computedStyle.fill,
      stroke: computedStyle.stroke,
    });
  }
}

// Helper function to apply color conversion
function applyColorConversion(element, computedStyle, convertColor) {
  // Text color
  if (
    computedStyle.color !== "transparent" &&
    computedStyle.color !== "rgba(0, 0, 0, 0)"
  ) {
    element.style.color = convertColor(computedStyle.color);
  }

  // Background color
  if (
    computedStyle.backgroundColor !== "transparent" &&
    computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)"
  ) {
    element.style.backgroundColor = convertColor(computedStyle.backgroundColor);
  }

  // Border color
  if (
    computedStyle.borderColor !== "transparent" &&
    computedStyle.borderColor !== "rgba(0, 0, 0, 0)"
  ) {
    element.style.borderColor = convertColor(computedStyle.borderColor);
  }

  // Handle SVG elements
  if (element instanceof SVGElement) {
    const fill = computedStyle.fill;
    const stroke = computedStyle.stroke;

    if (fill !== "none" && fill !== "transparent") {
      element.style.fill = convertColor(fill);
    }
    if (stroke !== "none" && stroke !== "transparent") {
      element.style.stroke = convertColor(stroke);
    }
  }

  // Handle images
  if (element.tagName === "IMG") {
    element.style.filter = getImageFilter(element.style.filter);
  }
}

// Helper function for image filters
function getImageFilter(currentFilter) {
  const filters = {
    protanopia: "saturate(150%) hue-rotate(20deg) contrast(110%)",
    deuteranopia: "saturate(150%) hue-rotate(-20deg) contrast(110%)",
    tritanopia: "saturate(150%) hue-rotate(60deg) contrast(110%)",
  };
  return filters[currentFilter] || currentFilter;
}

function removeProtanopiaStyle(elements) {
  isRedApplied = false;
  restoreOriginalStyles(elements);
}

function removeDeuteranopiaStyle(elements) {
  isGreenApplied = false;
  restoreOriginalStyles(elements);
}

function restoreOriginalStyles(elements) {
  for (let element of elements) {
    if (!(element instanceof Element)) continue;

    const originalStyle = originalStyles.get(element);
    if (originalStyle) {
      // Restore all original colors
      element.style.color = originalStyle.color || "";
      element.style.backgroundColor = originalStyle.backgroundColor || "";
      element.style.borderColor = originalStyle.borderColor || "";

      // Restore SVG properties if they exist
      if (element instanceof SVGElement) {
        element.style.fill = originalStyle.fill || "";
        element.style.stroke = originalStyle.stroke || "";
      }
    }
  }
  // Clear the stored original styles
  originalStyles.clear();
}
