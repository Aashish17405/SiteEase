// State variables
let states = {
  protanopia: false,
  deuteranopia: false,
  blueBlinds: false,
  yellowBlinds: false,
  achromatopsia: false,
  dyslexia: false,
};

// Storage keys
const STORAGE_KEYS = {
  PROTANOPIA: "isProtanopia",
  DEUTERANOPIA: "isDeuteranopia",
  BLUE_BLINDNESS: "isTritanopia",
  YELLOW_BLINDNESS: "isTritanomaly",
  ACHROMATOPSIA: "isAchromatopsia",
  DYSLEXIA: "isDyslexic",
};

// Initialize event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load saved states
  loadSavedStates();

  // Set up event listeners for each toggle
  setupToggle("protanopia", "protanopia-toggle", handleProtanopiaToggle);
  setupToggle("deuteranopia", "deuteranopia-toggle", handleDeuteranopiaToggle);
  setupToggle(
    "blue-blindness",
    "blue-blindness-toggle",
    handleBlueBlindnessToggle
  );
  setupToggle(
    "yellow-blindness",
    "yellow-blindness-toggle",
    handleYellowBlindnessToggle
  );
  setupToggle(
    "achromatopsia",
    "achromatopsia-toggle",
    handleAchromatopsiaToggle
  );
  setupToggle("dyslexia", "dyslexia-toggle", handleDyslexiaToggle);
});

// Load saved states from storage
function loadSavedStates() {
  chrome.storage.sync.get(Object.values(STORAGE_KEYS), (result) => {
    // Update states and UI based on saved values
    states.protanopia = result[STORAGE_KEYS.PROTANOPIA] || false;
    states.deuteranopia = result[STORAGE_KEYS.DEUTERANOPIA] || false;
    states.blueBlinds = result[STORAGE_KEYS.BLUE_BLINDNESS] || false;
    states.yellowBlinds = result[STORAGE_KEYS.YELLOW_BLINDNESS] || false;
    states.achromatopsia = result[STORAGE_KEYS.ACHROMATOPSIA] || false;
    states.dyslexia = result[STORAGE_KEYS.DYSLEXIA] || false;

    // Update UI to reflect saved states
    updateToggleUI("protanopia", states.protanopia);
    updateToggleUI("deuteranopia", states.deuteranopia);
    updateToggleUI("blue-blindness", states.blueBlinds);
    updateToggleUI("yellow-blindness", states.yellowBlinds);
    updateToggleUI("achromatopsia", states.achromatopsia);
    updateToggleUI("dyslexia", states.dyslexia);
  });
}

// Set up individual toggle
function setupToggle(id, toggleId, handler) {
  const checkbox = document.getElementById(id);
  if (checkbox) {
    checkbox.addEventListener("change", handler);
  }
}

// Update toggle UI
function updateToggleUI(elementId, isEnabled) {
  const toggle = document.getElementById(`${elementId}-toggle`);
  const checkbox = document.getElementById(elementId);

  if (!toggle || !checkbox) return;

  checkbox.checked = isEnabled;
  if (isEnabled) {
    toggle.classList.remove("bg-gray-500");
    toggle.classList.add("bg-green-500");
    toggle.querySelector("span").style.transform = "translateX(1.5rem)";
  } else {
    toggle.classList.remove("bg-green-500");
    toggle.classList.add("bg-gray-500");
    toggle.querySelector("span").style.transform = "translateX(0)";
  }
}

// Toggle handlers
function handleProtanopiaToggle(event) {
  states.protanopia = event.target.checked;
  // Disable other color blindness modes
  if (states.protanopia) {
    states.deuteranopia = false;
    states.blueBlinds = false;
    states.yellowBlinds = false;
    states.achromatopsia = false;
    states.dyslexia = false;
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
    updateToggleUI("dyslexia", false);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "protanopia",
      isActive: states.protanopia,
    });
  });

  chrome.storage.sync.set({ [STORAGE_KEYS.PROTANOPIA]: states.protanopia });
  updateToggleUI("protanopia", states.protanopia);
}

function handleDeuteranopiaToggle(event) {
  states.deuteranopia = event.target.checked;
  // Disable other color blindness modes
  if (states.deuteranopia) {
    states.protanopia = false;
    states.blueBlinds = false;
    states.yellowBlinds = false;
    states.achromatopsia = false;
    states.dyslexia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
    updateToggleUI("dyslexia", false);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "deuteranopia",
      isActive: states.deuteranopia,
    });
  });

  chrome.storage.sync.set({ [STORAGE_KEYS.DEUTERANOPIA]: states.deuteranopia });
  updateToggleUI("deuteranopia", states.deuteranopia);
}

function handleBlueBlindnessToggle(event) {
  states.blueBlinds = event.target.checked;
  // Disable other color blindness modes
  if (states.blueBlinds) {
    states.protanopia = false;
    states.deuteranopia = false;
    states.yellowBlinds = false;
    states.achromatopsia = false;
    states.dyslexia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
    updateToggleUI("dyslexia", false);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "tritanopia",
      isActive: states.blueBlinds,
    });
  });

  chrome.storage.sync.set({ [STORAGE_KEYS.BLUE_BLINDNESS]: states.blueBlinds });
  updateToggleUI("blue-blindness", states.blueBlinds);
}

function handleYellowBlindnessToggle(event) {
  states.yellowBlinds = event.target.checked;
  // Disable other color blindness modes
  if (states.yellowBlinds) {
    states.protanopia = false;
    states.deuteranopia = false;
    states.blueBlinds = false;
    states.achromatopsia = false;
    states.dyslexia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("achromatopsia", false);
    updateToggleUI("dyslexia", false);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "tritanomaly",
      isActive: states.yellowBlinds,
    });
  });

  chrome.storage.sync.set({
    [STORAGE_KEYS.YELLOW_BLINDNESS]: states.yellowBlinds,
  });
  updateToggleUI("yellow-blindness", states.yellowBlinds);
}

function handleAchromatopsiaToggle(event) {
  states.achromatopsia = event.target.checked;

  // Disable other color blindness modes
  if (states.achromatopsia) {
    states.protanopia = false;
    states.deuteranopia = false;
    states.blueBlinds = false;
    states.yellowBlinds = false;
    states.dyslexia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("dyslexia", false);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "achromatopsia",
      isActive: states.achromatopsia,
    });
  });

  chrome.storage.sync.set({
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
  updateToggleUI("achromatopsia", states.achromatopsia);
}

function handleDyslexiaToggle(event) {
  states.dyslexia = event.target.checked;

  // Disable other color blindness modes
  if (states.dyslexia) {
    states.protanopia = false;
    states.deuteranopia = false;
    states.blueBlinds = false;
    states.yellowBlinds = false;
    states.achromatopsia = false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "dyslexia",
      isDyslexic: states.dyslexia,
    });
  });

  chrome.storage.sync.set({ [STORAGE_KEYS.DYSLEXIA]: states.dyslexia });
  updateToggleUI("dyslexia", states.dyslexia);
}
