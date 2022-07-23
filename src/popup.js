import { getStorage } from './lib/storage';

document.body.onload = async () => {
    // Get stored values
    const data = await getStorage();
    document.getElementById('fixation').value = data.fixation;
    document.getElementById('saccade').value = data.saccade;
    document.getElementById('opacity').value = data.opacity;
    document.getElementById('fontWeight').value = data.fontWeight;

    // Add listeners
    document.getElementById('off-button').addEventListener('click', turnOff);
    document.getElementById('fixation').addEventListener('input', adjust.bind(this, 'fixation'));
    document.getElementById('saccade').addEventListener('input', adjust.bind(this, 'saccade'));
    document.getElementById('opacity').addEventListener('input', adjust.bind(this, 'opacity'));
    document.getElementById('fontWeight').addEventListener('input', adjust.bind(this, 'fontWeight'));
}

function turnOff() {
    chrome.runtime.sendMessage(null, { off: true });
    window.close();
}

function adjust(field) {
    const inputField = document.getElementById(field);
    chrome.runtime.sendMessage(null, { adjust: true, field, value: inputField.value });
}
