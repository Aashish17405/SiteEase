let isRed = false;
let isBlue = false;
let isAchromatopsic = false;
let isDyslexic = false;

const DYSLEXIA_KEY = 'isDyslexic';
const ACHROMATOPSIA_KEY = 'isAchromatopsic';
const BLUE_YELLOW_KEY = 'isBlue';
const RED_GREEN_KEY = 'isRed';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize event listeners
    document.getElementById('blue-yellow').addEventListener('click', toggleBlueYellow);
    document.getElementById('red-green').addEventListener('click', toggleRedGreen);
    document.getElementById('achromatopsia').addEventListener('click', toggleAchromatopsia);
    document.getElementById('dyslexia').addEventListener('click', toggleDyslexia);

    // Load and apply states
    loadAndApplyToggleState(DYSLEXIA_KEY, 'dyslexia', 'dyslexia-toggle', (state) => (isDyslexic = state));
    loadAndApplyToggleState(ACHROMATOPSIA_KEY, 'achromatopsia', 'achromatopsia-toggle', (state) => (isAchromatopsic = state));
    loadAndApplyToggleState(BLUE_YELLOW_KEY, 'blue-yellow', 'blue-yellow-toggle', (state) => (isBlue = state));
    loadAndApplyToggleState(RED_GREEN_KEY, 'red-green', 'red-green-toggle', (state) => (isRed = state));
});

function loadAndApplyToggleState(storageKey, elementId, toggleId, updateStateCallback) {
    chrome.storage.sync.get([storageKey], (result) => {
        const savedState = result[storageKey] || false;
        updateStateCallback(savedState)
        console.log('Saved state: ' + savedState);
        updateToggleUI(savedState, elementId, toggleId);
    });
}

function toggleRedGreen() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isRed = !isRed;
        chrome.storage.sync.set({ [RED_GREEN_KEY]: isRed }, () => {
            console.log(`Red-Green mode set to: ${isRed}`);
            
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'orange-turquoise',
                isRed
            });

            updateToggleUI(isRed, 'red-green', 'red-green-toggle');
        });
    });
}

function toggleBlueYellow() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isBlue = !isBlue;
        chrome.storage.sync.set({ [BLUE_YELLOW_KEY]: isBlue }, () => {
            console.log(`Blue-Yellow mode set to: ${isBlue}`);
            
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'cyan-beige',
                isBlue
            });

            updateToggleUI(isBlue, 'blue-yellow', 'blue-yellow-toggle');
        });
    });
}

function toggleAchromatopsia() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isAchromatopsic = !isAchromatopsic;
        chrome.storage.sync.set({ [ACHROMATOPSIA_KEY]: isAchromatopsic }, () => {
            console.log(`Achromatopsia mode set to: ${isAchromatopsic}`);
            
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'achromatopsia',
                isAchromatopsic
            });
            updateToggleUI(isAchromatopsic, 'achromatopsia', 'achromatopsia-toggle');
        });
    });
}

function toggleDyslexia() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isDyslexic = !isDyslexic;
        chrome.storage.sync.set({ [DYSLEXIA_KEY]: isDyslexic }, () => {
            console.log(`Dyslexia mode set to: ${isDyslexic}`);
            
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'dyslexia',
                isDyslexic
            });

            updateToggleUI(isDyslexic, 'dyslexia', 'dyslexia-toggle');
        });
    });
}

// Generalized toggle UI update function
function updateToggleUI(isEnabled, elementId, toggleId) {
    const toggle = document.getElementById(toggleId);
    const checkbox = document.getElementById(elementId);

    if (!toggle || !checkbox) return;

    if (isEnabled) {
        console.log('Toggle UI')
        toggle.classList.replace('bg-gray-500', 'bg-green-500');
        toggle.querySelector('span').style.transform = 'translateX(1.5rem)';
        checkbox.checked = true;

        // Specific handling for dyslexia font
        if (elementId === 'dyslexia') {
            document.body.style.fontFamily = "'OpenDyslexic', sans-serif";
        }
    } else {
        toggle.classList.replace('bg-green-500', 'bg-gray-500');
        toggle.querySelector('span').style.transform = 'translateX(0)';
        checkbox.checked = false;

        // Reset dyslexia font
        if (elementId === 'dyslexia') {
            document.body.style.fontFamily = '';
        }
    }
}
