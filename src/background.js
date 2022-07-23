import polyfill from './lib/polyfill';

const ON = 'Turn BiReader On';
const OFF = 'Turn BiReader Off';
let tabId = 0;

async function handleClick(tab) {
    // Extract tab id
    tabId = tab.id;

    // Set the popup
    chrome.action.setPopup({ popup: 'popup.html' });

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
    if (message.reload) {
        chrome.action.setPopup({ popup: '' });
    } else if (message.off) {
        chrome.action.setTitle({ tabId, title: ON });
        chrome.action.setIcon({ tabId, path: 'icons/32.png' });
        chrome.tabs.sendMessage(tabId, { activate: false });
        chrome.action.setPopup({ popup: '' });
    } else if (message.adjust) {
        chrome.tabs.sendMessage(tabId, { update: true, field: message.field, value: message.value });
    }
}

polyfill(() => {
    chrome.action.onClicked.addListener(handleClick);
    chrome.runtime.onMessage.addListener(handleMessage);
});
