const originalStyles = new Map();
const dyslexicFontURL = 'https://fonts.cdnfonts.com/css/opendyslexic';
let dyslexicFontApplied = false;

// Listener for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const elements = document.body.getElementsByTagName('*');
    console.log('Current state:', { isDyslexic: request.isdyslexic, dyslexicFontApplied });

    if (request.action === 'orange-turquoise') {
        handleColorBlindness(elements, 'orange-turquoise', request.isRed);
    } else if (request.action === 'cyan-beige') {
        handleColorBlindness(elements, 'cyan-beige', request.isBlue);
    } else if (request.action === 'achromotopic') {
        handleAchromotopic(elements, request.isAchromotopic);
    } else if (request.action === 'dyslexia') {
        if (request.isdyslexic && !dyslexicFontApplied) {
            console.log('Applying OpenDyslexic font...');
            applyDyslexicFont();
        } else if (!request.isdyslexic && dyslexicFontApplied) {
            console.log('Removing OpenDyslexic font...');
            removeDyslexicFont();
        }

        // Save dyslexia state
        chrome.storage.sync.set({ isDyslexic: request.isdyslexic }, () => {
            console.log(`Saved isDyslexic state: ${request.isdyslexic}`);
        });
    }
});

// Retrieve saved state on load
chrome.storage.sync.get(['isDyslexic'], (result) => {
    if (result.isDyslexic) {
        console.log('Applying saved Dyslexic font state...');
        applyDyslexicFont();
    }
});

// Handle color blindness transformations
function handleColorBlindness(elements, type, isActive) {
    for (let element of elements) {
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue;

        if (!originalStyles.has(element)) {
            originalStyles.set(element, { color: window.getComputedStyle(element).color });
        }

        if (isActive) {
            const color = window.getComputedStyle(element).color;
            const rgb = color.match(/\d+/g);

            if (rgb) {
                let [r, g, b] = rgb.map(Number);

                if (type === 'orange-turquoise') {
                    element.style.color = r > g && r > b ? '#FFA500' : g > r && g > b ? '#40E0D0' : originalStyles.get(element).color;
                } else if (type === 'cyan-beige') {
                    element.style.color = b > r && b > g ? '#00ffff' : r > g && g > b ? '#F5F5DC' : originalStyles.get(element).color;
                }
            }
        } else {
            element.style.color = originalStyles.get(element).color || '';
        }
    }
}

// Handle achromotopic transformation
function handleAchromotopic(elements, isActive) {
    for (let element of elements) {
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue;

        if (!originalStyles.has(element)) {
            originalStyles.set(element, { filter: window.getComputedStyle(element).filter });
        }

        element.style.filter = isActive ? 'grayscale(100%) contrast(150%)' : originalStyles.get(element).filter || '';
    }
}

// Apply Dyslexic font
function applyDyslexicFont() {
    const existingLink = document.getElementById('dyslexicFontStylesheet');
    if (!existingLink) {
        const link = document.createElement('link');
        link.href = dyslexicFontURL;
        link.rel = 'stylesheet';
        link.id = 'dyslexicFontStylesheet';
        document.head.appendChild(link);

        link.onload = () => {
            console.log('Font stylesheet loaded. Applying font family...');
            document.body.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
            dyslexicFontApplied = true;
        };

        link.onerror = () => {
            console.error('Failed to load OpenDyslexic font stylesheet.');
        };
    }
}

// Remove Dyslexic font
function removeDyslexicFont() {
    const link = document.getElementById('dyslexicFontStylesheet');
    if (link) link.remove();

    document.body.style.fontFamily = '';
    dyslexicFontApplied = false;
}
