let isRed = false;
let isBlue = false;
let isAchromotopic = false;

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

document.getElementById('check').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isAchromotopic = !isAchromotopic;
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'achromotopic', 
            isAchromotopic 
        });
    });
});