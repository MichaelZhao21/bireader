import { render, html } from 'uhtml/async';
import { getStorage, patchStorage, setStorage } from './storage';
import plainTag from 'plain-tag';
import { boldify, deboldify } from './boldify';
import { getGlobalStyles } from '../reader';

const setStyles = (element, properties) =>
    Object.entries(properties).forEach((kv) => element.style.setProperty(...kv, 'important'));

// Doesn't actually do anything, this is just so the ide will highlight the css inside the tag
// (WebStorm interprets anything inside css`` as css)
const css = plainTag;

const sliderTickMark = (min, max, val, sliderId, disp = (val) => val) => {
    const id = 'bi-slider-tick--' + sliderId;

    return html`
        <style>
            ${css`
                #${id} {
                    border: solid var(--text-muted);
                    border-width: 0 1px;
                    color: var(--text-muted);
                    position: relative;
                    margin-bottom: -4px;
                }
                /* min label */
                #${id} > :nth-child(1) {
                    float: left;
                }
                /* max label */
                #${id} > :nth-child(3) {
                    float: right;
                }
                /* current value label */
                #${id} > :nth-child(2) {
                    position: absolute;
                    left: calc(10px + (${(val - min) / (max - min)} * (100% - 20px)));
                    transform: translateX(-50%);
                    background-color: var(--background-body);
                }

                #${id} > :nth-child(1),
                :nth-child(3) {
                    font-size: 0.8rem;
                    padding: 0px 0.2rem;
                }
            `}
        </style>
        <div id=${id}>
            <span>${val === min ? '' : disp(min)}</span>
            <span>${disp(val)}</span>
            <span>${val === max ? '' : disp(max)}</span>
        </div>
    `;
};

async function updateBolding() {
    deboldify();
    boldify(await getStorage());
    document.getElementById('bi-style').innerText = getGlobalStyles(await getStorage());
}

// Add a UI to control the extension settings.
// It will be isolated from the rest of the page it's injected into with shadow DOM.
export default async function ui() {
    const container = document.createElement('div');
    setStyles(container, {
        all: 'initial',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '2147483647',
    });
    container.attachShadow({ mode: 'open' });

    const waterCssUrl = chrome.runtime.getURL('water.min.css');

    const initialState = {
        open: false,
    };

    const rangeData = [
        {
            min: 0,
            max: 1,
            step: 0.1,
            name: 'fixation',
            label: 'Fixation',
            help: 'Percent of the word that is bolded',
        },
        {
            min: 0,
            max: 5,
            step: 1,
            name: 'saccade',
            label: 'Saccade',
            // help: "Distance (in words) between bolded words"
            // help: "How many words to skip bolding"
            help: 'Number of words to skip between each bolded word',
        },
        {
            min: 0,
            max: 1,
            step: 0.1,
            name: 'opacity',
            label: 'Opacity',
            help: "Opacity of the bolded text (useful if font weight doesn't work)",
        },
        {
            min: 100,
            max: 1000,
            step: 100,
            name: 'fontWeight',
            label: 'Font weight',
            help: 'Thickness of the bolded text; may not work properly with non-variable-weight fonts',
        },
    ];

    await (async function update(state = initialState) {
        const storage = await getStorage();

        render(
            container.shadowRoot,
            html`
                <link rel="stylesheet" href=${waterCssUrl} />
                ${state.open
                    ? html`
                          <style>
                              #bi-main {
                                  background-color: var(--background-body);
                                  border: 2px solid var(--background-alt);
                                  padding: 0.5rem;
                                  border-radius: 0.5rem;
                                  display: flex;
                                  flex-direction: column;
                                  gap: 0.5rem;
                                  width: 250px;
                                  max-width: calc(100vh - 4rem);
                                  max-height: calc(100vh - 20px - 1rem - 20px);
                              }
                              h2 {
                                  margin: 0;
                              }

                              #bi-ranges {
                                  display: flex;
                                  flex-direction: column;
                                  gap: 0.5rem;
                                  overflow: auto;
                              }
                              .bi-range {
                                  display: flex;
                                  flex-direction: column;
                                  gap: 0.25rem;
                                  margin-bottom: 0.5rem;
                              }
                              .bi-range > span {
                                  color: var(--text-muted);
                                  font-size: 0.8rem;
                              }
                              .bi-range > label {
                                  font-size: 0.9rem;
                              }
                              input[type='range'] {
                                  margin: 0;
                                  padding: 3px 0;
                              }
                              input[type='range']:active {
                                  transform: none;
                              }

                              .bi-actions {
                                  display: flex;
                              }
                              .bi-actions > :first-child {
                                  font-size: 0.8rem;
                              }
                              .bi-actions > :last-child {
                                  flex: 1;
                              }
                              button {
                                  min-width: 100px;
                                  padding: 10px;
                              }
                          </style>
                          <div id="bi-main">
                              <h2>BiReader</h2>
                              <div id="bi-ranges">
                                  ${rangeData.map(
                                      ({ min, max, step, name, label, help }, i) => html.for(
                                          rangeData[i]
                                      )`
                            <div class="bi-range">
                                <label for=${'bi-' + name}>${label}</label>
                                ${sliderTickMark(min, max, storage[name], name)}
                                <input type="range" min=${min} max=${max} step=${step} name=${
                                          'bi-' + name
                                      } value=${storage[name]} onchange=${async (e) => {
                                          await patchStorage({ [name]: Number(e.target.value) });
                                          await update(state);
                                          await updateBolding();
                                      }} />
                                <span>${help}</span>
                            </div>
                        `
                                  )}
                              </div>
                              <div class="bi-actions">
                                  <button
                                      onclick=${() => {
                                          // Remove controls from the page
                                          container.remove();
                                      }}
                                  >
                                      Hide controls
                                  </button>
                                  <button
                                      onclick=${() => {
                                          update({ ...state, open: false });
                                      }}
                                  >
                                      Close
                                  </button>
                              </div>
                          </div>
                      `
                    : html`
                          <style>
                              button {
                                  padding: 10px;
                                  margin: 0;
                                  display: flex;
                              }
                              img {
                                  width: 20px;
                                  height: 20px;
                              }
                          </style>
                          <button
                              onclick=${() => {
                                  update({ ...state, open: true });
                              }}
                          >
                              <img
                                  src=${chrome.runtime.getURL('icons/32.png')}
                                  alt="BiReader icon"
                              />
                          </button>
                      `}
            `
        );
    })();

    document.body.appendChild(container);
}
