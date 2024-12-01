let isRed = false;
let isBlue = false;
let isAchromotopic = false;
let isDyslexic = false;

document.getElementById('blue-yellow').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isBlue = !isBlue;
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'cyan-beige',
            isBlue
        });
    });
});

document.getElementById('red-green').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isRed = !isRed;
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'orange-turquoise',
            isRed
        });
    });
});

document.getElementById('achromatopsia').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isAchromotopic = !isAchromotopic;
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'achromotopic', 
            isAchromotopic 
        });
    });
});


document.getElementById('dyslexia').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isDyslexic = !isDyslexic;

        chrome.storage.sync.set({ isDyslexic }, () => {
            console.log(`Dyslexic mode set to: ${isDyslexic}`);
        });

        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'dyslexia',
            isdyslexic: isDyslexic
        });
    });
});

const DYSLEXIA_KEY = 'isdyslexic';

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('dyslexia-toggle');
    const checkbox = document.getElementById('dyslexia');

    // Load state from localStorage
    const isDyslexic = JSON.parse(localStorage.getItem(DYSLEXIA_KEY)) || false;

    // Apply the state to the toggle and UI
    updateToggleUI(isDyslexic);

    // Handle toggle changes
    checkbox.addEventListener('change', () => {
        const currentState = checkbox.checked;

        // Save state to localStorage
        localStorage.setItem(DYSLEXIA_KEY, JSON.stringify(currentState));

        // Update the toggle UI
        updateToggleUI(currentState);

        // Apply changes to the current site (add your logic here)
        console.log('Dyslexia state changed:', currentState);
    });
});

// Function to update the toggle button UI
function updateToggleUI(isDyslexic) {
    const toggle = document.getElementById('dyslexia-toggle');
    const checkbox = document.getElementById('dyslexia');

    if (isDyslexic) {
        toggle.classList.replace('bg-gray-500', 'bg-green-500');
        toggle.querySelector('span').classList.add('translate-x-6');
        checkbox.checked = true;

        // Apply dyslexia-friendly font (example)
        document.body.style.fontFamily = "'OpenDyslexic', sans-serif";
    } else {
        toggle.classList.replace('bg-green-500', 'bg-gray-500');
        toggle.querySelector('span').classList.remove('translate-x-6');
        checkbox.checked = false;

        // Reset font
        document.body.style.fontFamily = '';
    }
}