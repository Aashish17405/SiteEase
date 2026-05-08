// ── STATE ─────────────────────────────────────────────────────────────────
let states = {
  protanopia: false,
  deuteranopia: false,
  blueBlinds: false,
  yellowBlinds: false,
  achromatopsia: false,
  dyslexia: false,
  // New features
  fontSize: 16, // in px  (default 16)
  zoom: 100, // in %   (default 100)
  imagesHidden: false,
  dictionaryQuery: "",
  dictionaryLoading: false,
  textToSpeech: false,
  textToSpeechRate: 1,
};

// ── STORAGE KEYS ──────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  PROTANOPIA: "isProtanopia",
  DEUTERANOPIA: "isDeuteranopia",
  BLUE_BLINDNESS: "isTritanopia",
  YELLOW_BLINDNESS: "isTritanomaly",
  ACHROMATOPSIA: "isAchromatopsia",
  DYSLEXIA: "isDyslexic",
  // New features
  FONT_SIZE: "seFontSize",
  ZOOM: "seZoom",
  IMAGES_HIDDEN: "seImagesHidden",
  TEXT_TO_SPEECH: "seTextToSpeech",
  TEXT_TO_SPEECH_RATE: "seTextToSpeechRate",
};

// ── FONT SIZE CONFIG ───────────────────────────────────────────────────────
const FONT_MIN = 10; // px
const FONT_MAX = 32; // px
const FONT_STEP = 2; // px

// ── ZOOM CONFIG ────────────────────────────────────────────────────────────
const ZOOM_MIN = 50; // %
const ZOOM_MAX = 200; // %
const ZOOM_STEP = 10; // %

// ── INIT ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadSavedStates();

  // Colour-blindness toggles
  setupToggle("protanopia", handleProtanopiaToggle);
  setupToggle("deuteranopia", handleDeuteranopiaToggle);
  setupToggle("blue-blindness", handleBlueBlindnessToggle);
  setupToggle("yellow-blindness", handleYellowBlindnessToggle);
  setupToggle("achromatopsia", handleAchromatopsiaToggle);
  setupToggle("dyslexia", handleDyslexiaToggle);
  setupToggle("text-to-speech", handleTextToSpeechToggle);
  setupTextToSpeechSpeedControl();

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

  // Editable middle value for font size
  const fontDisplayInput = document.getElementById("font-size-display");
  if (fontDisplayInput) {
    fontDisplayInput.value = states.fontSize + "px";
    fontDisplayInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleFontInputApply(fontDisplayInput.value);
        fontDisplayInput.blur();
      }
    });
    fontDisplayInput.addEventListener("blur", () => {
      handleFontInputApply(fontDisplayInput.value);
    });
  }

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

  const dictionaryInput = document.getElementById("dictionary-input");
  const dictionaryLookupBtn = document.getElementById("dictionary-lookup");
  const dictionarySelectionBtn = document.getElementById(
    "dictionary-use-selection",
  );

  if (dictionaryInput) {
    dictionaryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        lookupDictionaryEntry(dictionaryInput.value);
      }
    });
  }

  if (dictionaryLookupBtn) {
    dictionaryLookupBtn.addEventListener("click", () => {
      lookupDictionaryEntry(dictionaryInput ? dictionaryInput.value : "");
    });
  }

  if (dictionarySelectionBtn) {
    dictionarySelectionBtn.addEventListener("click", () => {
      captureSelectionAndLookup();
    });
  }

  loadSelectionIntoDictionary(false);
});

// ── LOAD SAVED STATES ──────────────────────────────────────────────────────
function loadSavedStates() {
  chrome.storage.sync.get(Object.values(STORAGE_KEYS), (result) => {
    // Colour toggles
    states.protanopia = result[STORAGE_KEYS.PROTANOPIA] || false;
    states.deuteranopia = result[STORAGE_KEYS.DEUTERANOPIA] || false;
    states.blueBlinds = result[STORAGE_KEYS.BLUE_BLINDNESS] || false;
    states.yellowBlinds = result[STORAGE_KEYS.YELLOW_BLINDNESS] || false;
    states.achromatopsia = result[STORAGE_KEYS.ACHROMATOPSIA] || false;
    states.dyslexia = result[STORAGE_KEYS.DYSLEXIA] || false;
    applyPopupDyslexiaFont();

    updateToggleUI("protanopia", states.protanopia);
    updateToggleUI("deuteranopia", states.deuteranopia);
    updateToggleUI("blue-blindness", states.blueBlinds);
    updateToggleUI("yellow-blindness", states.yellowBlinds);
    updateToggleUI("achromatopsia", states.achromatopsia);
    updateToggleUI("dyslexia", states.dyslexia);
    updateToggleUI("text-to-speech", states.textToSpeech);

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

    // Text to speech
    states.textToSpeech = result[STORAGE_KEYS.TEXT_TO_SPEECH] || false;
    updateToggleUI("text-to-speech", states.textToSpeech);

    const savedRate = Number(result[STORAGE_KEYS.TEXT_TO_SPEECH_RATE]);
    if (!Number.isNaN(savedRate)) {
      states.textToSpeechRate = normalizeTextToSpeechRate(savedRate);
      if (savedRate !== states.textToSpeechRate) {
        chrome.storage.sync.set({
          [STORAGE_KEYS.TEXT_TO_SPEECH_RATE]: states.textToSpeechRate,
        });
      }
    }
    updateTextToSpeechSpeedDisplay();

    // If no filter is active, check active tab's localStorage for a recommendation
    const noFilterActive =
      !states.protanopia &&
      !states.deuteranopia &&
      !states.blueBlinds &&
      !states.yellowBlinds &&
      !states.achromatopsia &&
      !states.dyslexia;

    if (noFilterActive) {
      checkAndApplyRecommendation();
    }
  });
}

function checkAndApplyRecommendation() {
  if (!chrome.scripting || typeof chrome.scripting.executeScript !== "function") return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || typeof tab.id === "undefined") return;

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          try {
            const raw = window.localStorage.getItem("siteease_recommended_filter");
            return raw ? JSON.parse(raw) : null;
          } catch (_) {
            return null;
          }
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) return;
        const rec = results[0].result;
        if (!rec || !rec.filter) return;

        const filterKey = String(rec.filter).toLowerCase();
        const FILTER_TO_STORAGE_KEY = {
          protanopia: "isProtanopia",
          deuteranopia: "isDeuteranopia",
          tritanopia: "isTritanopia",
          tritanomaly: "isTritanomaly",
          achromatopsia: "isAchromatopsia",
        };
        const UI_MAP = {
          protanopia: "protanopia",
          deuteranopia: "deuteranopia",
          tritanopia: "blue-blindness",
          tritanomaly: "yellow-blindness",
          achromatopsia: "achromatopsia",
          dyslexia: "dyslexia",
        };

        if (filterKey === "dyslexia") {
          states.dyslexia = true;
          applyPopupDyslexiaFont();
          updateToggleUI("dyslexia", true);
          sendToActiveTab({ action: "dyslexia", isDyslexic: true });
          chrome.storage.sync.set({ [STORAGE_KEYS.DYSLEXIA]: true });
        } else if (FILTER_TO_STORAGE_KEY[filterKey]) {
          updateToggleUI(UI_MAP[filterKey], true);
          sendToActiveTab({ action: filterKey, isActive: true });
          chrome.storage.sync.set({ [FILTER_TO_STORAGE_KEY[filterKey]]: true });
        }
      }
    );
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

function applyPopupDyslexiaFont() {
  document.body.classList.toggle("popup-dyslexia-font", Boolean(states.dyslexia));
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
    states.deuteranopia =
      states.blueBlinds =
      states.yellowBlinds =
      states.achromatopsia =
        false;
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "protanopia", isActive: states.protanopia });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]: states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]: states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]: states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]: states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleDeuteranopiaToggle(event) {
  states.deuteranopia = event.target.checked;
  if (states.deuteranopia) {
    states.protanopia =
      states.blueBlinds =
      states.yellowBlinds =
      states.achromatopsia =
        false;
    updateToggleUI("protanopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "deuteranopia", isActive: states.deuteranopia });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]: states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]: states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]: states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]: states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleBlueBlindnessToggle(event) {
  states.blueBlinds = event.target.checked;
  if (states.blueBlinds) {
    states.protanopia =
      states.deuteranopia =
      states.yellowBlinds =
      states.achromatopsia =
        false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("yellow-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "tritanopia", isActive: states.blueBlinds });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]: states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]: states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]: states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]: states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleYellowBlindnessToggle(event) {
  states.yellowBlinds = event.target.checked;
  if (states.yellowBlinds) {
    states.protanopia =
      states.deuteranopia =
      states.blueBlinds =
      states.achromatopsia =
        false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("achromatopsia", false);
  }
  sendToActiveTab({ action: "tritanomaly", isActive: states.yellowBlinds });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]: states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]: states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]: states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]: states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleAchromatopsiaToggle(event) {
  states.achromatopsia = event.target.checked;
  if (states.achromatopsia) {
    states.protanopia =
      states.deuteranopia =
      states.blueBlinds =
      states.yellowBlinds =
        false;
    updateToggleUI("protanopia", false);
    updateToggleUI("deuteranopia", false);
    updateToggleUI("blue-blindness", false);
    updateToggleUI("yellow-blindness", false);
  }
  sendToActiveTab({ action: "achromatopsia", isActive: states.achromatopsia });
  chrome.storage.sync.set({
    [STORAGE_KEYS.PROTANOPIA]: states.protanopia,
    [STORAGE_KEYS.DEUTERANOPIA]: states.deuteranopia,
    [STORAGE_KEYS.BLUE_BLINDNESS]: states.blueBlinds,
    [STORAGE_KEYS.YELLOW_BLINDNESS]: states.yellowBlinds,
    [STORAGE_KEYS.ACHROMATOPSIA]: states.achromatopsia,
  });
}

function handleDyslexiaToggle(event) {
  states.dyslexia = event.target.checked;
  applyPopupDyslexiaFont();
  sendToActiveTab({ action: "dyslexia", isDyslexic: states.dyslexia });
  chrome.storage.sync.set({ [STORAGE_KEYS.DYSLEXIA]: states.dyslexia });
}

function handleTextToSpeechToggle(event) {
  states.textToSpeech = event.target.checked;
  sendToActiveTab({
    action: "textToSpeech",
    isEnabled: states.textToSpeech,
    rate: states.textToSpeechRate,
  });
  chrome.storage.sync.set({
    [STORAGE_KEYS.TEXT_TO_SPEECH]: states.textToSpeech,
  });
}

function setupTextToSpeechSpeedControl() {
  const slider = document.getElementById("tts-speed");
  const previewBtn = document.getElementById("tts-preview");
  if (!slider) return;

  slider.value = String(states.textToSpeechRate);
  slider.addEventListener("input", () => {
    const rate = Number(slider.value);
    if (Number.isNaN(rate)) return;
    states.textToSpeechRate = normalizeTextToSpeechRate(rate);
    updateTextToSpeechSpeedDisplay();
    chrome.storage.sync.set({
      [STORAGE_KEYS.TEXT_TO_SPEECH_RATE]: states.textToSpeechRate,
    });
    sendToActiveTab({
      action: "textToSpeechRate",
      rate: states.textToSpeechRate,
    });
  });

  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      sendToActiveTab({
        action: "textToSpeechPreview",
      });
    });
  }
}

function updateTextToSpeechSpeedDisplay() {
  const slider = document.getElementById("tts-speed");
  const valueEl = document.getElementById("tts-speed-value");
  if (slider) slider.value = String(states.textToSpeechRate);
  if (valueEl) valueEl.textContent = `${states.textToSpeechRate.toFixed(2)}x`;
}

function normalizeTextToSpeechRate(rate) {
  const min = 0.5;
  const max = 2;
  return Math.min(max, Math.max(min, rate));
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
  if (el) el.value = states.fontSize + "px";

  // Dim the − button when at min, + when at max
  const decBtn = document.getElementById("font-dec");
  const incBtn = document.getElementById("font-inc");
  if (decBtn) decBtn.style.opacity = states.fontSize <= FONT_MIN ? "0.35" : "1";
  if (incBtn) incBtn.style.opacity = states.fontSize >= FONT_MAX ? "0.35" : "1";
}

function handleFontInputApply(raw) {
  const normalized = String(raw || "").trim();
  if (!normalized) {
    setFontInputStatus("Please enter a size like 18 or 18px", true);
    return;
  }

  // Extract number
  const m = normalized.match(/^(\d+)(?:\s*px)?$/i);
  if (!m) {
    setFontInputStatus(
      'Invalid format. Use a number optionally with "px" (e.g. 73 or 73px).',
      true,
    );
    return;
  }

  const num = parseInt(m[1], 10);
  if (Number.isNaN(num) || num <= 0) {
    setFontInputStatus("Enter a positive integer number of pixels.", true);
    return;
  }

  // Apply immediately (allow outside FONT_MAX)
  states.fontSize = num;
  applyFontSize();
  setFontInputStatus(`Applied ${num}px`);
}

function setFontInputStatus(msg, isError = false) {
  const statusEl = document.getElementById("dictionary-status");
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.classList.toggle("dictionary-error", Boolean(isError));
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
    callActionOnActiveTab({ action: "image" });
  } else {
    callActionOnActiveTab({ action: "imageAdd" });
  }
  updateImagesDisplay();
  chrome.storage.sync.set({
    [STORAGE_KEYS.IMAGES_HIDDEN]: states.imagesHidden,
  });
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

// Robust active-tab action caller with scripting fallback
function callActionOnActiveTab(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || typeof tab.id === "undefined") return;

    // Try messaging the content script first
    chrome.tabs.sendMessage(tab.id, msg, (response) => {
      if (!chrome.runtime.lastError) {
        return; // content script handled it
      }

      // Fallback: use scripting to run DOM changes directly
      if (
        !chrome.scripting ||
        typeof chrome.scripting.executeScript !== "function"
      ) {
        return;
      }

      if (msg.action === "image") {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              document.querySelectorAll("img").forEach((img) => {
                try {
                  img.style.setProperty("display", "none", "important");
                } catch (e) {
                  img.style.display = "none";
                }
              });
            },
          },
          () => {},
        );
      } else if (msg.action === "imageAdd") {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: () => {
              document.querySelectorAll("img").forEach((img) => {
                try {
                  img.style.removeProperty("display");
                } catch (e) {
                  img.style.display = "";
                }
              });
            },
          },
          () => {},
        );
      }
    });
  });
}

// ── DICTIONARY ────────────────────────────────────────────────────────────
function loadSelectionIntoDictionary(autoLookup = false) {
  const inputEl = document.getElementById("dictionary-input");

  readSelectedTextFromSession((sessionSelection) => {
    if (sessionSelection) {
      if (inputEl) {
        inputEl.value = sessionSelection;
      }
      setDictionaryStatus(`Recent highlight detected: ${sessionSelection}`);
      if (autoLookup) {
        lookupDictionaryEntry(sessionSelection);
      }
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab || typeof tab.id === "undefined") {
        setDictionaryStatus("Open a webpage, highlight text, and try again.");
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { action: "getSelectedText" },
        (response) => {
          if (chrome.runtime.lastError) {
            setDictionaryStatus(
              "This page does not expose selectable text to the extension. Paste a word instead.",
            );
            return;
          }

          const selectedText = (
            response && response.selectedText ? response.selectedText : ""
          ).trim();
          if (selectedText) {
            if (inputEl) {
              inputEl.value = selectedText;
            }
            setDictionaryStatus(`Selected text detected: ${selectedText}`);
            if (autoLookup) {
              lookupDictionaryEntry(selectedText);
            }
            return;
          }

          setDictionaryStatus(
            "No highlighted text found. Highlight a word on the page or paste one below.",
          );
          if (inputEl && !inputEl.value.trim()) {
            inputEl.focus();
          }
        },
      );
    });
  });
}

function captureSelectionAndLookup() {
  const inputEl = document.getElementById("dictionary-input");

  readSelectionFromActiveTab((selectedText) => {
    const normalizedText = normalizeDictionaryQuery(selectedText);

    if (!normalizedText) {
      setDictionaryStatus(
        "Highlight a word on the page first, then try again.",
        true,
      );
      if (inputEl && !inputEl.value.trim()) {
        inputEl.focus();
      }
      return;
    }

    if (inputEl) {
      inputEl.value = normalizedText;
    }

    setDictionaryStatus(`Selected text detected: ${normalizedText}`);
    lookupDictionaryEntry(normalizedText);
  });
}

function readSelectedTextFromSession(callback) {
  chrome.storage.session.get(
    ["seLastSelectedText", "seLastSelectedAt"],
    (sessionResult) => {
      const sessionText = normalizeDictionaryQuery(
        sessionResult.seLastSelectedText || "",
      );
      const sessionTimestamp = Number(sessionResult.seLastSelectedAt || 0);
      const sessionIsRecent =
        sessionText &&
        sessionTimestamp &&
        Date.now() - sessionTimestamp <= 15000;

      if (sessionIsRecent) {
        callback(sessionText);
        return;
      }

      chrome.storage.local.get(
        ["seLastSelectedText", "seLastSelectedAt"],
        (localResult) => {
          const localText = normalizeDictionaryQuery(
            localResult.seLastSelectedText || "",
          );
          const localTimestamp = Number(localResult.seLastSelectedAt || 0);
          const localIsRecent =
            localText && localTimestamp && Date.now() - localTimestamp <= 15000;

          callback(localIsRecent ? localText : "");
        },
      );
    },
  );
}

function readSelectionFromActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || typeof tab.id === "undefined") {
      callback("");
      return;
    }

    if (
      !chrome.scripting ||
      typeof chrome.scripting.executeScript !== "function"
    ) {
      callback("");
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const selection = window.getSelection
            ? window.getSelection().toString().trim()
            : "";

          if (selection) {
            return selection;
          }

          const activeElement = document.activeElement;
          if (!activeElement) {
            return "";
          }

          const tagName = activeElement.tagName;
          const isTextInput =
            tagName === "INPUT" ||
            tagName === "TEXTAREA" ||
            activeElement.isContentEditable;

          if (!isTextInput) {
            return "";
          }

          const value = activeElement.value || activeElement.textContent || "";
          const start = activeElement.selectionStart;
          const end = activeElement.selectionEnd;

          if (
            typeof start === "number" &&
            typeof end === "number" &&
            start !== end
          ) {
            return value.slice(start, end).trim();
          }

          return "";
        },
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          callback("");
          return;
        }

        callback(results[0].result || "");
      },
    );
  });
}

function setDictionaryStatus(message, isError = false) {
  const statusEl = document.getElementById("dictionary-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.toggle("dictionary-error", Boolean(isError));
}

function setDictionaryResult(contentHtml, shouldHide = false) {
  const resultEl = document.getElementById("dictionary-result");
  if (!resultEl) return;

  resultEl.innerHTML = contentHtml;
  resultEl.classList.toggle("hidden", shouldHide);
}

function normalizeDictionaryQuery(text) {
  return String(text || "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDictionaryCandidates(text) {
  const normalized = normalizeDictionaryQuery(text);
  const candidates = [];

  if (!normalized) {
    return candidates;
  }

  candidates.push(normalized);

  if (normalized.includes(" ")) {
    const firstWord = normalized.split(" ")[0];
    if (firstWord && firstWord.length > 1 && firstWord !== normalized) {
      candidates.push(firstWord);
    }
  }

  return [...new Set(candidates)];
}

async function fetchDictionaryEntry(term) {
  const encodedTerm = encodeURIComponent(term);
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodedTerm}`,
  );

  if (!response.ok) {
    throw new Error("Definition not found");
  }

  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Definition not found");
  }

  return data;
}

function getEntryScore(entry, query) {
  const normalizedQuery = normalizeDictionaryQuery(query).toLowerCase();
  const word = String(entry.word || "").toLowerCase();
  const meanings = Array.isArray(entry.meanings) ? entry.meanings : [];
  const hasVerb = meanings.some(
    (meaning) => String(meaning.partOfSpeech || "").toLowerCase() === "verb",
  );
  const hasNoun = meanings.some(
    (meaning) => String(meaning.partOfSpeech || "").toLowerCase() === "noun",
  );
  const definitionCount = meanings.reduce(
    (count, meaning) =>
      count +
      (Array.isArray(meaning.definitions) ? meaning.definitions.length : 0),
    0,
  );
  let score = 0;

  if (word === normalizedQuery) score += 10;
  if (hasVerb) score += 3;
  if (hasNoun) score += 1;
  score += Math.min(definitionCount, 5);

  if (
    /ed$/.test(normalizedQuery) ||
    /ing$/.test(normalizedQuery) ||
    /en$/.test(normalizedQuery)
  ) {
    if (hasVerb) score += 8;
  }

  if (normalizedQuery === "made" && hasVerb) {
    score += 20;
  }

  return score;
}

function pickBestEntry(entries, query) {
  return (
    entries
      .slice()
      .sort(
        (left, right) =>
          getEntryScore(right, query) - getEntryScore(left, query),
      )[0] || null
  );
}

function pickBestMeaning(meanings, query) {
  if (!Array.isArray(meanings) || meanings.length === 0) {
    return null;
  }

  const normalizedQuery = normalizeDictionaryQuery(query).toLowerCase();
  const preferredPartOfSpeech =
    /ed$/.test(normalizedQuery) ||
    /ing$/.test(normalizedQuery) ||
    normalizedQuery === "made"
      ? "verb"
      : "";

  const scoredMeanings = meanings.map((meaning) => {
    const partOfSpeech = String(meaning.partOfSpeech || "").toLowerCase();
    const definitions = Array.isArray(meaning.definitions)
      ? meaning.definitions
      : [];
    let score = definitions.length;

    if (partOfSpeech === preferredPartOfSpeech && preferredPartOfSpeech) {
      score += 20;
    }
    if (partOfSpeech === "verb") score += 4;
    if (partOfSpeech === "noun") score += 1;
    if (definitions.some((definition) => definition && definition.example))
      score += 2;

    return { meaning, score };
  });

  scoredMeanings.sort((left, right) => right.score - left.score);
  return scoredMeanings[0].meaning;
}

function extractMeaning(entry) {
  const phonetic =
    entry.phonetic ||
    (Array.isArray(entry.phonetics) &&
    entry.phonetics.find((item) => item && item.text)
      ? entry.phonetics.find((item) => item && item.text).text
      : "");
  const meaning = pickBestMeaning(entry.meanings, entry.word || "");
  const definitions =
    meaning && Array.isArray(meaning.definitions)
      ? meaning.definitions.slice(0, 2)
      : [];

  return {
    word: entry.word || "Unknown",
    phonetic,
    partOfSpeech: meaning ? meaning.partOfSpeech : "",
    definitions,
  };
}

function renderDictionaryEntry(entry, query, usedFallback = false) {
  const meaning = extractMeaning(entry);
  const definitionMarkup = meaning.definitions.length
    ? meaning.definitions
        .map((item, index) => {
          const example = item.example
            ? `<div class="dictionary-definition"><strong>Example ${index + 1}:</strong> ${escapeHtml(item.example)}</div>`
            : "";
          return `<div class="dictionary-definition"><strong>${index + 1}.</strong> ${escapeHtml(item.definition || "No definition available.")}</div>${example}`;
        })
        .join("")
    : '<div class="dictionary-definition">No definition was returned for this entry.</div>';

  setDictionaryResult(`
    <div class="dictionary-headword">
      <div>
        <div class="dictionary-word">${escapeHtml(meaning.word)}</div>
        ${meaning.phonetic ? `<div class="dictionary-phonetic">${escapeHtml(meaning.phonetic)}</div>` : ""}
      </div>
      ${meaning.partOfSpeech ? `<div class="dictionary-pos">${escapeHtml(meaning.partOfSpeech)}</div>` : ""}
    </div>
    <div class="dictionary-definition">${usedFallback ? `Looked up <strong>${escapeHtml(query)}</strong> using the closest matching word.` : `Meaning for <strong>${escapeHtml(query)}</strong>.`}</div>
    ${definitionMarkup}
  `);
}

async function lookupDictionaryEntry(rawText) {
  const inputEl = document.getElementById("dictionary-input");
  const query = normalizeDictionaryQuery(rawText);

  if (!query) {
    setDictionaryStatus("Enter or highlight a word first.", true);
    setDictionaryResult("", true);
    if (inputEl) inputEl.focus();
    return;
  }

  states.dictionaryQuery = query;
  states.dictionaryLoading = true;
  setDictionaryStatus(`Looking up “${query}”…`);
  setDictionaryResult(``, true);

  const candidates = buildDictionaryCandidates(query);

  try {
    let bestEntry = null;
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const data = await fetchDictionaryEntry(candidate);
      const selectedEntry = pickBestEntry(data, candidate);
      if (selectedEntry) {
        bestEntry = selectedEntry;
        renderDictionaryEntry(selectedEntry, query, candidate !== query);
        setDictionaryStatus(
          candidate === query
            ? "Definition loaded successfully."
            : `Definition loaded using the closest match: ${candidate}`,
        );
        states.dictionaryLoading = false;
        return;
      }
      setDictionaryStatus(
        candidate === query
          ? "Definition loaded successfully."
          : `Definition loaded using the closest match: ${candidate}`,
      );
    }

    if (bestEntry) {
      renderDictionaryEntry(bestEntry, query, true);
      states.dictionaryLoading = false;
      return;
    }

    throw new Error("Definition not found");
  } catch (error) {
    states.dictionaryLoading = false;
    setDictionaryStatus(
      `No definition found for “${query}”. Try a single word or a simpler form.`,
      true,
    );
    setDictionaryResult(`
      <div class="dictionary-definition dictionary-error">
        We could not find a dictionary entry for <strong>${escapeHtml(query)}</strong>.
      </div>
    `);
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
