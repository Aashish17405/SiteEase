let isBold = false;
document.getElementById('boldButton').addEventListener('click', () => {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        isBold =!isBold;
        chrome.tabs.sendMessage(tabs[0].id, { action: 'makeBold', isBold });
    });
});
