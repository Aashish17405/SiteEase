chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'makeBold') {
        const elements = document.body.getElementsByTagName('*');
        for (let element of elements) {
            if (request.isBold) {
                element.style.fontWeight = 'bold';
            } else {
                element.style.fontWeight = 'normal';
            }
        }
    }
});