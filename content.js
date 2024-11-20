const originalStyles = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const elements = document.body.getElementsByTagName('*');
    
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

    if (request.action === 'cyan-beige') {
        for (let element of elements) {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                continue;
            }

            if (!originalStyles.has(element)) {
                originalStyles.set(element, { color: window.getComputedStyle(element).color });
            }

            if (request.isBlue) {
                const color = window.getComputedStyle(element).color;
                const rgb = color.match(/\d+/g);

                if (rgb) {
                    let [r, g, b] = rgb.map(Number);

                    if (b > r && b > g) {
                        // Blue tones shift to cyan
                        element.style.color = '#00ffff';
                    } else if (r > g && g > b) {
                        // yellow tones shift to beige
                        element.style.color = '#F5F5DC';
                    } else {
                        element.style.color = originalStyles.get(element).color;
                    }
                }
            } else {
                element.style.color = originalStyles.get(element).color || '';
            }
        }
    }

    if (request.action === 'achromotopic') {
        for (let element of elements) {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                continue;
            }

            if (!originalStyles.has(element)) {
                originalStyles.set(element, { fontWeight: window.getComputedStyle(element).fontWeight });
            }

            if (request.isAchromotopic) {
                element.style.color = '#F5F5F5';
            } else {
                element.style.color = originalStyles.get(element).color || '';
            }
        }
    }
});
