function toggleBold(data) {
    console.log(data);
    if (!data.activate) {
        window.location.reload();
    } else {
        boldifyText();
    }
}

function boldifyText() {
    const nodes = document.body.querySelectorAll('p,h1,h2,h3,h4,li,a,span,div');
    for (let i = 0; i < nodes.length; i++) {
        const children = nodes[i].childNodes.length;
        for (let j = 0; j < children; j++) {
            const child = nodes[i].firstChild;
            if (child.nodeType !== Node.TEXT_NODE || child.textContent.trim() === '') {
                nodes[i].appendChild(child);
            } else {
                const newNode = document.createElement('span');
                newNode.innerHTML = child.textContent
                    .replace(/([A-Za-zÀ-ú]+)\b/g, function (x) {
                        const l = Math.ceil(x.length / 2);
                        return `<b>${x.substring(0, l)}</b>${x.substring(l)}`;
                    })
                    .replace(/(\d+)/g, '<b>$1</b>');
                nodes[i].removeChild(child);
                nodes[i].appendChild(newNode);
            }
        }
    }
}

chrome.runtime.onMessage.addListener(toggleBold);
