import polyfill from './lib/polyfill';

const ON = 'Turn BiReader On';
const OFF = 'BiReader Settings';

async function handleMessage(message) {
    // Get the tab
    const tabList = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabList[0];
    const tabId = tab.id;

    // Process the message
    if (message.popupOpen) {
        popupOpen(tabId);
    } else if (message.off) {
        chrome.action.setTitle({ tabId, title: ON });
        chrome.action.setIcon({ tabId, path: 'icons/32.png' });
        chrome.tabs.sendMessage(tabId, { activate: false });
    } else if (message.adjust) {
        chrome.tabs.sendMessage(tabId, { update: true, field: message.field, value: message.value });
    }
}

async function popupOpen(tabId) {
    // Change the text and color on click
    chrome.action.getTitle({ tabId }, (title) => {
        if (title === ON) {
            chrome.action.setTitle({ tabId, title: OFF });
            chrome.action.setIcon({ tabId, path: 'icons/32-alt.png' });
            chrome.tabs.sendMessage(tabId, { activate: true });
        }
    });
}

polyfill(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
});
