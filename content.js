const originalStyles = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const elements = document.body.getElementsByTagName('*');

    if (request.action === 'makeBold') {
        for (let element of elements) {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                continue;
            }

            if (!originalStyles.has(element)) {
                originalStyles.set(element, { fontWeight: window.getComputedStyle(element).fontWeight });
            }

            if (request.isBold) {
                element.style.fontWeight = 'bold';
            } else {
                element.style.fontWeight = originalStyles.get(element).fontWeight || '';
            }
        }
    }
    
    if (request.action === 'orange-turquoise') {
        for (let element of elements) {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                continue;
            }

            if (!originalStyles.has(element)) {
                originalStyles.set(element, { color: window.getComputedStyle(element).color });
            }

            if (request.isRed) {
                const color = window.getComputedStyle(element).color;
                const rgb = color.match(/\d+/g);

                if (rgb) {
                    let [r, g, b] = rgb.map(Number);

                    if (r > g && r > b) {
                        // Red tones shift to orange
                        element.style.color = '#FFA500';
                    } else if (g > r && g > b) {
                        // Green tones shift to turquoise
                        element.style.color = '#40E0D0';
                    } else {
                        element.style.color = originalStyles.get(element).color;
                    }
                }
            } else {
                element.style.color = originalStyles.get(element).color || '';
            }
        }
    }
});
