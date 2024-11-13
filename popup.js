let isBold = false;
let isRed = false;

document.getElementById('check').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isBold = !isBold;
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'makeBold', 
            isBold 
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
