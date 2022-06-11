function toggleBold(data) {
    console.log(data);
    if (!data.activate) {
        window.location.reload();
    } else {
        boldifyText();
    }
}

function boldifyText() {
    // Process all nodes that are not "bold" tagged elements
    const nodes = document.body.querySelectorAll(':not(b)');
    for (let i = 0; i < nodes.length; i++) {
        const children = nodes[i].childNodes.length;
        for (let j = 0; j < children; j++) {
            const child = nodes[i].firstChild;
            if (child.nodeType !== Node.TEXT_NODE || child.textContent.trim() === '') {
                nodes[i].appendChild(child);
            } else {
                const newNode = document.createElement('span');
                newNode.classList.add('bi-bold');
                newNode.innerHTML = child.textContent
                    .replace(/([A-Za-zÀ-ú]+)\b/g, function (x) {
                        const l = Math.ceil(x.length / 2);
                        return `<b>${x.substring(0, l)}</b>${x.substring(l)}`;
                    })
                    .replace(/(\d+|[\!-\.:;=?@\[-`{-~])/g, '<b>$1</b>');

                nodes[i].removeChild(child);
                nodes[i].appendChild(newNode);
            }
        }
    }

    // Inject bold css
    const path = chrome.extension.getURL('style.css');
    const link = document.createElement('link');
    link.href = path;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
}

chrome.runtime.onMessage.addListener(toggleBold);
