import { boldify } from "../lib/boldify";
import polyfill from "../lib/polyfill";

function toggleBold(data) {
    console.log(data);
    if (!data.activate) {
        window.location.reload();
    } else {
        boldifyText();
    }
}

function boldifyText() {
    boldify(document.body);

    // Inject bold css
    const path = chrome.runtime.getURL('assets/style.css');
    const link = document.createElement('link');
    link.href = path;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
}

polyfill(() => {
    chrome.runtime.onMessage.addListener(toggleBold);
});
