import polyfill from './lib/polyfill';

const ON = 'Turn BiReader On';
const OFF = 'BiReader Settings';
let tabId = 0;

async function handleClick(tab) {
    // Extract tab id
    tabId = tab.id;

    // Change the text and color on click
    chrome.action.getTitle({ tabId }, (title) => {
        if (title === ON) {
            chrome.action.setTitle({ tabId, title: OFF });
            chrome.action.setIcon({ tabId, path: 'icons/32-alt.png' });
            chrome.tabs.sendMessage(tabId, { activate: true });
        }
    });
}

async function handleMessage(message) {
    console.log(message);
    const tabList = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabList[0];
    if (message.popupOpen) {
        handleClick(tab);
    } else if (message.off) {
        chrome.action.setTitle({ tabId, title: ON });
        chrome.action.setIcon({ tabId, path: 'icons/32.png' });
        chrome.tabs.sendMessage(tabId, { activate: false });
    } else if (message.adjust) {
        chrome.tabs.sendMessage(tabId, { update: true, field: message.field, value: message.value });
    }
}

polyfill(() => {
    chrome.action.onClicked.addListener(handleClick);
    chrome.runtime.onMessage.addListener(handleMessage);
});
