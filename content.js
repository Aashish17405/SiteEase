const originalStyles = new Map();
const dyslexicFontURL = 'https://cdn.jsdelivr.net/npm/opendyslexic@0.0.3/fonts/OpenDyslexic-Regular.woff2';
let dyslexicFontApplied = false;
let isAchromatopsicStyleApplied = false;

// Listener for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const elements = document.body.getElementsByTagName('*');
    console.log('Current state:', { isDyslexic: request.isdyslexic, dyslexicFontApplied });
    console.log('Current state:', { isAchromatopsic: request.isAchromatopsic, isAchromatopsicStyleApplied});

    if (request.action === 'orange-turquoise') {
        handleColorBlindness(elements, 'orange-turquoise', request.isRed);
    } else if (request.action === 'cyan-beige') {
        handleColorBlindness(elements, 'cyan-beige', request.isBlue);
    } else if (request.action === 'achromatopsia') {
        if(request.isAchromatopsic && !isAchromatopsicStyleApplied){
            console.log('Applying Achromatopsia style...');
            applyAchromatopsicStyle(elements, request.isAchromatopsic);
        }else if(!request.isAchromatopsic && isAchromatopsicStyleApplied){
            console.log('Removing Achromatopsia style...');
            removeAchromatopsicStyle(elements, request.isAchromatopsic);
        }

        chrome.storage.sync.set({ isAchromatopsic: request.isAchromatopsic}, () => {
            console.log(`Saved isAchromatopsic state: ${request.isAchromatopsic}`);
        })
    } else if (request.action === 'dyslexia') {
        if (request.isDyslexic && !dyslexicFontApplied) {
            console.log('Applying OpenDyslexic font...');
            applyDyslexicFont();
        } else if (!request.isDyslexic && dyslexicFontApplied) {
            console.log('Removing OpenDyslexic font...');
            removeDyslexicFont();
        }

        // Save dyslexia state
        chrome.storage.sync.set({ isDyslexic: request.isdyslexic }, () => {
            console.log(`Saved isDyslexic state: ${request.isdyslexic}`);
        });
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

chrome.storage.sync.get(['isAchromatopsic'], (result) => {
    const isAchromatopsic = result.isAchromatopsic || false;
    if (isAchromatopsic) {
        console.log('Applying saved Achromatopsia style...');
        applyAchromatopsicStyle(document.body.getElementsByTagName('*'), isAchromatopsic);
    }
});

function applyAchromatopsicStyle(elements, isActive) {
    for (let element of elements) {
        if (!(element instanceof Element)) continue;
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue;

        if (!originalStyles.has(element)) {
            originalStyles.set(element, { filter: window.getComputedStyle(element).filter });
        }
        if (isActive) {
            element.style.filter = 'grayscale(100%) contrast(150%)';
            isAchromatopsicStyleApplied = true;
        }
    }
}

function removeAchromatopsicStyle(elements, isActive) {
    for (let element of elements) {
        if (!(element instanceof Element)) continue;
        if (!originalStyles.has(element)) {
            originalStyles.set(element, { filter: window.getComputedStyle(element).filter });
        }
        element.style.filter = originalStyles.get(element).filter || '';
        isAchromatopsicStyleApplied = false;
    }
}

chrome.storage.sync.get(['isDyslexic'], (result) => {
    if (result.isDyslexic) {
        console.log('Applying saved Dyslexic font state...');
        applyDyslexicFont();
    }
});

// Inject Inline CSS
function injectCssInline(id, style) {
    if (document.getElementById(id)) return; // Avoid duplicate styles

    const head = document.head || document.getElementsByTagName('head')[0];
    const sheet = document.createElement('style');

    sheet.setAttribute('id', id);
    sheet.type = 'text/css';
    sheet.appendChild(document.createTextNode(style));
    head.appendChild(sheet);
}

function applyDyslexicFont() {
    const dyslexicFontCSS = `
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('${dyslexicFontURL}') format('woff2');
            font-weight: normal;
            font-style: normal;
        }
        * {
            font-family: 'OpenDyslexic', Arial, sans-serif !important;
        }
    `;

    injectCssInline('dyslexicFontStylesheet', dyslexicFontCSS);
    dyslexicFontApplied = true;
}

// Remove Dyslexic Font
function removeDyslexicFont() {
    const styleElement = document.getElementById('dyslexicFontStylesheet');
    if (styleElement) {
        styleElement.remove();
        dyslexicFontApplied = false;
    }
}