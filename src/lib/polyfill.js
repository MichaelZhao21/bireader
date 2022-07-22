import chromePolyfill from 'webextension-polyfill';

export default async function polyfill(fn) {
    if (process.env.IS_FIREFOX) {
        globalThis.chrome = chromePolyfill;
        // action is called browserAction in manifest v2
        chrome.action = chrome.browserAction;
    }
    await fn();
}
