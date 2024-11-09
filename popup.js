let isBold = false;

document.getElementById('boldButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isBold = !isBold;
        // Send message without originalStyle as we'll handle it in content script
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'makeBold', 
            isBold 
        });
    });
});