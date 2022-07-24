import { boldify, deboldify } from './lib/boldify';
import polyfill from './lib/polyfill';
import { patchStorage, getStorage } from './lib/storage';
import { getBiStyle } from './lib/util';

async function toggleBold(data) {
    createLoading();

    // Set timeout because loading screen needs a few ms to show up
    setTimeout(async () => {
        if (data.update) {
            await patchStorage({ [data.field]: Number(data.value) });
            deboldify();
            boldify(await getStorage());
        } else if (!data.activate) {
            deboldify();
        } else {
            runBoldify();
        }

        stopLoading();
    }, 100);
}

async function runBoldify() {
    // Boldify
    const storage = await getStorage();
    boldify(storage);

    // Append bi-style
    const s = document.createElement('style');
    s.id = 'bi-style';
    s.innerText = getBiStyle(storage);
    document.head.appendChild(s);
}

function createLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'bireader-loading-container';
    const loadingHeading = document.createElement('h1');
    loadingHeading.id = 'bireader-loading-heading';
    loadingHeading.textContent = 'Applying BiReader Bolding...';
    const loading = document.createElement('div');
    loading.id = 'bireader-loading';
    loadingDiv.appendChild(loadingHeading);
    loadingDiv.appendChild(loading);
    document.body.appendChild(loadingDiv);
}

function stopLoading() {
    document.getElementById('bireader-loading-container').remove();
}

polyfill(() => {
    chrome.runtime.onMessage.addListener(toggleBold);
});
