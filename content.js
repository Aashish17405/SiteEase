const originalStyles = new Map();
const dyslexicFontURL = 'https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap';
let dyslexicFontApplied = false;

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const elements = document.body.getElementsByTagName('*');

    if (request.action === 'orange-turquoise') {
        handleColorBlindness(elements, 'orange-turquoise', request.isRed);
    } else if (request.action === 'cyan-beige') {
        handleColorBlindness(elements, 'cyan-beige', request.isBlue);
    } else if (request.action === 'achromotopic') {
        handleAchromotopic(elements, request.isAchromotopic);
    } else if (request.action === 'dyslexia') {
        handleDyslexiaFont(request.isdyslexic);
    }
});

// Helper Functions

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

function handleAchromotopic(elements, isActive) {
    for (let element of elements) {
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue;

        if (!originalStyles.has(element)) {
            originalStyles.set(element, { filter: window.getComputedStyle(element).filter });
        }

        element.style.filter = isActive ? 'grayscale(100%) contrast(150%)' : originalStyles.get(element).filter || '';
    }
}

function handleDyslexiaFont(isDyslexic) {
    if (isDyslexic && !dyslexicFontApplied) {
        console.log('Applying OpenDyslexic font');
        const link = document.createElement('link');
        link.href = dyslexicFontURL;
        link.rel = 'stylesheet';
        link.id = 'dyslexicFontStylesheet';
        document.head.appendChild(link);

        document.body.style.fontFamily = "'OpenDyslexic', Arial, sans-serif";
        dyslexicFontApplied = true;
    } else {
        console.log('Removing OpenDyslexic font');
        const link = document.getElementById('dyslexicFontStylesheet');
        if (link) link.remove();

        document.body.style.fontFamily = '';
        dyslexicFontApplied = false;
    }
}