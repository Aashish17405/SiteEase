const originalStyles = new Map();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'makeBold') {
        const elements = document.body.getElementsByTagName('*');
        
        for (let element of elements) {
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                continue;
            }
            if (!originalStyles.has(element)) {
                originalStyles.set(element, 
                    window.getComputedStyle(element).fontWeight
                );
            }

            if (request.isBold) {
                element.style.fontWeight = 'bold';
            } else {
                element.style.fontWeight = originalStyles.get(element);
            }
        }
    }
});