// Boldify the given dom node according to the parameters provided.
export function boldify({ fixation, saccade }) {
    // Process all nodes that are not "bold" tagged elements
    const nodes = document.body.querySelectorAll(':not(b)');
    let counter = 0;
    nodes.forEach((node) =>
        Array.from({ length: node.childNodes.length }, () => {
            const child = node.firstChild;
            if (child.nodeType !== Node.TEXT_NODE || child.textContent.trim() === '') {
                node.appendChild(child);
            } else {
                const newNode = document.createElement('span');
                newNode.classList.add('bi-bold');
                newNode.innerHTML = child.textContent
                    .replace(/([A-Za-zÀ-ú]+)\b/g, function (x) {
                        if (counter++ % (saccade + 1) !== 0) return x;
                        const l = Math.ceil(x.length * fixation);
                        return `<b>${x.substring(0, l)}</b>${x.substring(l)}`;
                    })
                    .replace(/(\d+|[\!-\.:;=?@\[-`{-~])/g, '<b>$1</b>');

                node.removeChild(child);
                node.appendChild(newNode);
            }
        })
    );
}

// Undo the boldify operation on the given dom node.
export const deboldify = () =>
    [...document.body.getElementsByClassName('bi-bold')]
        // setting an element's innerText to itself clears all tags wrapping any parts of its contents
        // (which achieves our goal of removing the b tags while keeping the text inside)
        .forEach((e) => (e.innerText = e.innerText));
