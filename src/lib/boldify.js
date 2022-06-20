// Boldify the given dom node according to the parameters provided.
export function boldify(node, fixation = 0.5, saccade = 0) {
    // Process all nodes that are not "bold" tagged elements
    const nodes = node.querySelectorAll(':not(b)');
    let counter = 0;
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
                        if((counter++) % (saccade + 1) !== 0) return x;
                        const l = Math.ceil(x.length * fixation);
                        return `<b>${x.substring(0, l)}</b>${x.substring(l)}`;
                    })
                    .replace(/(\d+|[\!-\.:;=?@\[-`{-~])/g, '<b>$1</b>');

                nodes[i].removeChild(child);
                nodes[i].appendChild(newNode);
            }
        }
    }
}