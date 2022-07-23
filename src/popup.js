import { getStorage } from './lib/storage';

document.body.onload = async () => {
    // Get stored values
    const data = await getStorage();
    document.getElementById('fixation').value = data.fixation;
    document.getElementById('saccade').value = data.saccade;
    document.getElementById('opacity').value = data.opacity;
    document.getElementById('fontWeight').value = data.fontWeight;
    change('fixation', null, data.fixation);
    change('saccade', null, data.saccade);
    change('opacity', null, data.opacity);
    change('fontWeight', null, data.fontWeight);

    // Add listeners
    document.getElementById('off-button').addEventListener('click', turnOff);
    document.getElementById('fixation').addEventListener('mouseup', adjust.bind(this, 'fixation'));
    document.getElementById('saccade').addEventListener('mouseup', adjust.bind(this, 'saccade'));
    document.getElementById('opacity').addEventListener('mouseup', adjust.bind(this, 'opacity'));
    document
        .getElementById('fontWeight')
        .addEventListener('mouseup', adjust.bind(this, 'fontWeight'));

    document.getElementById('fixation').addEventListener('input', change.bind(this, 'fixation'));
    document.getElementById('saccade').addEventListener('input', change.bind(this, 'saccade'));
    document.getElementById('opacity').addEventListener('input', change.bind(this, 'opacity'));
    document
        .getElementById('fontWeight')
        .addEventListener('input', change.bind(this, 'fontWeight'));
};

// Turn off BiReader when button clicked
function turnOff() {
    chrome.runtime.sendMessage(null, { off: true });
    window.close();
}

// Adjust the boldifying when mouseup
function adjust(field) {
    const inputField = document.getElementById(field);
    chrome.runtime.sendMessage(null, { adjust: true, field, value: inputField.value });
}

// Change the label whenever the user moves the input slider
function change(field, event, defValue = null) {
    const inputField = document.getElementById(field);
    const markerField = document.getElementById(field + '-marker');

    // Get the value from input or passed in value
    let newVal = defValue ? defValue : inputField.value;

    let newMargin = 0;
    if (field === 'fixation') {
        newMargin = `${Math.round(newVal * 90)}%`;
        newVal = `${Math.round(newVal * 100)}%`;
    } else if (field === 'saccade') {
        newMargin = `${Math.round((newVal * 97) / 5)}%`;
    } else if (field === 'opacity') {
        newMargin = `${Math.round(newVal * 90)}%`;
        newVal = `${Math.round(newVal * 100)}%`;
    } else if (field === 'fontWeight') {
        newMargin = `${Math.round(((newVal - 100) * 90) / 900)}%`;
    }

    markerField.textContent = newVal;
    markerField.style.marginLeft = newMargin;
}
