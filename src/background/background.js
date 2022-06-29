import polyfill from "../lib/polyfill";

async function handleClick(tab) {
    const ON = 'Turn BiReader On';
    const OFF = 'Turn BiReader Off';
    chrome.action.getTitle({ tabId: tab.id }, (title) => {
        if (title === ON) {
            chrome.action.setTitle({ tabId: tab.id, title: OFF });
            chrome.action.setIcon({ tabId: tab.id, path: 'icons/32-alt.png' });
            chrome.tabs.sendMessage(tab.id, { activate: true });
        } else {
            chrome.action.setTitle({ tabId: tab.id, title: ON });
            chrome.action.setIcon({ tabId: tab.id, path: 'icons/32.png' });
            chrome.tabs.sendMessage(tab.id, { activate: false });
        }
    });
}

polyfill(() => {
    chrome.action.onClicked.addListener(handleClick);
});