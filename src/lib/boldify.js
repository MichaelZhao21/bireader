// Boldify the given dom node according to the parameters provided.
export function boldify(node, { fixation, saccade, opacity }) {
    // Process all nodes that are not "bold" tagged elements
    const nodes = node.querySelectorAll(':not(b)');
    let counter = 0;
    nodes.forEach(node => (
        Array.from({ length: node.childNodes.length }, () => {
            const child = node.firstChild;
            if(child.nodeType !== Node.TEXT_NODE || child.textContent.trim() === '') {
                node.appendChild(child);
            } else {
                const newNode = document.createElement('span');
                newNode.classList.add('bi-bold');
                newNode.innerHTML = child.textContent
                    .replace(/([A-Za-zÀ-ú]+)\b/g, function (x) {
                        if((counter++) % (saccade + 1) !== 0) return x;
                        const l = Math.ceil(x.length * fixation);
                        return `<b>${x.substring(0, l)}</b>${x.substring(l)}`;
                    })
                    .replace(/(\d+|[\!-\.:;=?@\[-`{-~])/g, '<b>$1</b>');

                node.removeChild(child);
                node.appendChild(newNode);
            }
        })
    ));
}

// Undo the boldify operation on the given dom node.
// TODO: not tested, autogenerated by copilot
export function deboldify(node) {
    const nodes = node.querySelectorAll('.bi-bold');
    nodes.forEach(node => (
        Array.from({ length: node.childNodes.length }, () => {
            const child = node.firstChild;
            if (child.nodeType !== Node.TEXT_NODE || child.textContent.trim() === '') {
                node.appendChild(child);
            } else {
                const newNode = document.createElement('span');
                newNode.innerHTML = child.textContent.replace(/<b>([\!-\.:;=?@\[-`{-~])<\/b>/g, '$1');
                node.removeChild(child);
                node.appendChild(newNode);
            }
        })
    ));
}