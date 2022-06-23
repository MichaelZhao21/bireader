let cachedStorage = undefined;

export const setStorage = async val => (await chrome.storage.sync.set(val), cachedStorage = val);

export const patchStorage = async patch => await setStorage({ ...(await getStorage()), ...patch });

export const getStorage = async () => cachedStorage ?? (await chrome.storage.sync.get() ?? await setStorage({
    fixation: 0.5,
    saccade: 0,
    opacity: 1
}));