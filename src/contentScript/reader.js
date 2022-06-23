import { boldify } from "../lib/boldify";
import polyfill from "../lib/polyfill";
import ui from "../lib/ui";
import {getStorage} from "../lib/storage";

function toggleBold(data) {
    console.log(data);
    if (!data.activate) {
        window.location.reload();
    } else {
        boldifyText();
    }
}

export const getGlobalStyles = (fontWeight, opacity) => `
.bi-bold b {
    font-weight: ${fontWeight} !important;
    opacity: ${opacity === 1 ? "inherit" : opacity} !important;
}
`;

async function boldifyText() {
    const storage = await getStorage();
    boldify(document.body, storage);

    // Inject bold css
    // const path = chrome.runtime.getURL('assets/style.css');
    // const link = document.createElement('link');
    // link.href = path;
    // link.type = 'text/css';
    // link.rel = 'stylesheet';
    // document.getElementsByTagName('head')[0].appendChild(link);

    const s = document.createElement("style");
    s.innerText = getGlobalStyles(700, storage.opacity);
    document.head.appendChild(s);

    await ui(s);
}

polyfill(() => {
    chrome.runtime.onMessage.addListener(toggleBold);
});
