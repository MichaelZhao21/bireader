import { boldify, deboldify } from './lib/boldify';
import polyfill from './lib/polyfill';
import { patchStorage, getStorage } from './lib/storage';
import { getBiStyle } from './lib/util';

async function toggleBold(data) {
    if (data.update) {
        await patchStorage({ [data.field]: Number(data.value) });
        deboldify();
        boldify(await getStorage());
        document.getElementById('bi-style').innerText = getBiStyle(await getStorage());
    }
    else if (!data.activate) {
        deboldify();
    } else {
        runBoldify();
    }
}

async function runBoldify() {
    const storage = await getStorage();
    boldify(storage);

    const s = document.createElement('style');
    s.id = 'bi-style';
    s.innerText = getBiStyle(storage);
    document.head.appendChild(s);
}

polyfill(() => {
    chrome.runtime.sendMessage(null, { reload: true });
    chrome.runtime.onMessage.addListener(toggleBold);
});
