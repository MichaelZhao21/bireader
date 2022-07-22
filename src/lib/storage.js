let cachedStorage = undefined;

export const setStorage = async (val) => (
    await chrome.storage.sync.set(val), (cachedStorage = val)
);

export const patchStorage = async (patch) => {
    const prevStorage = await getStorage();
    await setStorage({ ...prevStorage, ...patch });
};

export const getStorage = async () => {
    if (cachedStorage) return cachedStorage;
    const storage = chrome.storage.sync.get();
    if (!storage || Object.keys(storage).length === 0) {
        return await setStorage({
            fixation: 0.5,
            saccade: 0,
            opacity: 1,
            fontWeight: 700,
        });
    }
    return (cachedStorage = storage);
};
