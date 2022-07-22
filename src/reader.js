import { boldify } from './lib/boldify';
import polyfill from './lib/polyfill';
import ui from './lib/ui';
import { getStorage } from './lib/storage';

function toggleBold(data) {
    console.log(data);
    if (!data.activate) {
        window.location.reload();
    } else {
        boldifyText();
    }
}

export const getGlobalStyles = ({ fontWeight, opacity }) => `
.bi-bold b {
    font-weight: ${fontWeight} !important;
    opacity: ${opacity === 1 ? 'inherit' : opacity} !important;
}
`;

async function boldifyText() {
    const storage = await getStorage();
    boldify(document.body, storage);

    const s = document.createElement('style');
    s.id = 'bi-style';
    s.innerText = getGlobalStyles(storage);
    document.head.appendChild(s);

    await ui();
}

polyfill(() => {
    chrome.runtime.onMessage.addListener(toggleBold);
});
