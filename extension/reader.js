(function (exports) {
    'use strict';

    (function() {
        const env = {"IS_FIREFOX":"true","NODE_ENV":"development"};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    // Boldify the given dom node according to the parameters provided.
    function boldify(node, { fixation, saccade }) {
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
    const deboldify = node => [...node.getElementsByClassName("bi-bold")]
        // setting an element's innerText to itself clears all tags wrapping any parts of its contents
        // (which achieves our goal of removing the b tags while keeping the text inside)
        .forEach(e => e.innerText = e.innerText);

    const isFirefox = process.env.IS_FIREFOX === "true";
    process.env.NODE_ENV === "development";

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var browserPolyfill = {exports: {}};

    (function (module, exports) {
    	(function (global, factory) {
    	  {
    	    factory(module);
    	  }
    	})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function (module) {

    	  if (typeof globalThis != "object" || typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) {
    	    throw new Error("This script should only be loaded in a browser extension.");
    	  }

    	  if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
    	    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    	    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    	    // optimization for Firefox. Since Spidermonkey does not fully parse the
    	    // contents of a function until the first time it's called, and since it will
    	    // never actually need to be called, this allows the polyfill to be included
    	    // in Firefox nearly for free.

    	    const wrapAPIs = extensionAPIs => {
    	      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
    	      // at build time by replacing the following "include" with the content of the
    	      // JSON file.
    	      const apiMetadata = {
    	        "alarms": {
    	          "clear": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "clearAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "get": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "getAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "bookmarks": {
    	          "create": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "get": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getChildren": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getRecent": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getSubTree": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getTree": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "move": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          },
    	          "remove": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeTree": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "search": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "update": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          }
    	        },
    	        "browserAction": {
    	          "disable": {
    	            "minArgs": 0,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "enable": {
    	            "minArgs": 0,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "getBadgeBackgroundColor": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getBadgeText": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getPopup": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getTitle": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "openPopup": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "setBadgeBackgroundColor": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "setBadgeText": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "setIcon": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "setPopup": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "setTitle": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          }
    	        },
    	        "browsingData": {
    	          "remove": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          },
    	          "removeCache": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeCookies": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeDownloads": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeFormData": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeHistory": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeLocalStorage": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removePasswords": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removePluginData": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "settings": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "commands": {
    	          "getAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "contextMenus": {
    	          "remove": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "update": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          }
    	        },
    	        "cookies": {
    	          "get": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getAll": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getAllCookieStores": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "remove": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "set": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "devtools": {
    	          "inspectedWindow": {
    	            "eval": {
    	              "minArgs": 1,
    	              "maxArgs": 2,
    	              "singleCallbackArg": false
    	            }
    	          },
    	          "panels": {
    	            "create": {
    	              "minArgs": 3,
    	              "maxArgs": 3,
    	              "singleCallbackArg": true
    	            },
    	            "elements": {
    	              "createSidebarPane": {
    	                "minArgs": 1,
    	                "maxArgs": 1
    	              }
    	            }
    	          }
    	        },
    	        "downloads": {
    	          "cancel": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "download": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "erase": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getFileIcon": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "open": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "pause": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeFile": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "resume": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "search": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "show": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          }
    	        },
    	        "extension": {
    	          "isAllowedFileSchemeAccess": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "isAllowedIncognitoAccess": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "history": {
    	          "addUrl": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "deleteAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "deleteRange": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "deleteUrl": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getVisits": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "search": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "i18n": {
    	          "detectLanguage": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getAcceptLanguages": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "identity": {
    	          "launchWebAuthFlow": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "idle": {
    	          "queryState": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "management": {
    	          "get": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "getSelf": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "setEnabled": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          },
    	          "uninstallSelf": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          }
    	        },
    	        "notifications": {
    	          "clear": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "create": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "getAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "getPermissionLevel": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "update": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          }
    	        },
    	        "pageAction": {
    	          "getPopup": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getTitle": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "hide": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "setIcon": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "setPopup": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "setTitle": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          },
    	          "show": {
    	            "minArgs": 1,
    	            "maxArgs": 1,
    	            "fallbackToNoCallback": true
    	          }
    	        },
    	        "permissions": {
    	          "contains": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getAll": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "remove": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "request": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "runtime": {
    	          "getBackgroundPage": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "getPlatformInfo": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "openOptionsPage": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "requestUpdateCheck": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "sendMessage": {
    	            "minArgs": 1,
    	            "maxArgs": 3
    	          },
    	          "sendNativeMessage": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          },
    	          "setUninstallURL": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "sessions": {
    	          "getDevices": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "getRecentlyClosed": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "restore": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          }
    	        },
    	        "storage": {
    	          "local": {
    	            "clear": {
    	              "minArgs": 0,
    	              "maxArgs": 0
    	            },
    	            "get": {
    	              "minArgs": 0,
    	              "maxArgs": 1
    	            },
    	            "getBytesInUse": {
    	              "minArgs": 0,
    	              "maxArgs": 1
    	            },
    	            "remove": {
    	              "minArgs": 1,
    	              "maxArgs": 1
    	            },
    	            "set": {
    	              "minArgs": 1,
    	              "maxArgs": 1
    	            }
    	          },
    	          "managed": {
    	            "get": {
    	              "minArgs": 0,
    	              "maxArgs": 1
    	            },
    	            "getBytesInUse": {
    	              "minArgs": 0,
    	              "maxArgs": 1
    	            }
    	          },
    	          "sync": {
    	            "clear": {
    	              "minArgs": 0,
    	              "maxArgs": 0
    	            },
    	            "get": {
    	              "minArgs": 0,
    	              "maxArgs": 1
    	            },
    	            "getBytesInUse": {
    	              "minArgs": 0,
    	              "maxArgs": 1
    	            },
    	            "remove": {
    	              "minArgs": 1,
    	              "maxArgs": 1
    	            },
    	            "set": {
    	              "minArgs": 1,
    	              "maxArgs": 1
    	            }
    	          }
    	        },
    	        "tabs": {
    	          "captureVisibleTab": {
    	            "minArgs": 0,
    	            "maxArgs": 2
    	          },
    	          "create": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "detectLanguage": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "discard": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "duplicate": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "executeScript": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "get": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getCurrent": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          },
    	          "getZoom": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "getZoomSettings": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "goBack": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "goForward": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "highlight": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "insertCSS": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "move": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          },
    	          "query": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "reload": {
    	            "minArgs": 0,
    	            "maxArgs": 2
    	          },
    	          "remove": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "removeCSS": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "sendMessage": {
    	            "minArgs": 2,
    	            "maxArgs": 3
    	          },
    	          "setZoom": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "setZoomSettings": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "update": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          }
    	        },
    	        "topSites": {
    	          "get": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "webNavigation": {
    	          "getAllFrames": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "getFrame": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          }
    	        },
    	        "webRequest": {
    	          "handlerBehaviorChanged": {
    	            "minArgs": 0,
    	            "maxArgs": 0
    	          }
    	        },
    	        "windows": {
    	          "create": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "get": {
    	            "minArgs": 1,
    	            "maxArgs": 2
    	          },
    	          "getAll": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "getCurrent": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "getLastFocused": {
    	            "minArgs": 0,
    	            "maxArgs": 1
    	          },
    	          "remove": {
    	            "minArgs": 1,
    	            "maxArgs": 1
    	          },
    	          "update": {
    	            "minArgs": 2,
    	            "maxArgs": 2
    	          }
    	        }
    	      };

    	      if (Object.keys(apiMetadata).length === 0) {
    	        throw new Error("api-metadata.json has not been included in browser-polyfill");
    	      }
    	      /**
    	       * A WeakMap subclass which creates and stores a value for any key which does
    	       * not exist when accessed, but behaves exactly as an ordinary WeakMap
    	       * otherwise.
    	       *
    	       * @param {function} createItem
    	       *        A function which will be called in order to create the value for any
    	       *        key which does not exist, the first time it is accessed. The
    	       *        function receives, as its only argument, the key being created.
    	       */


    	      class DefaultWeakMap extends WeakMap {
    	        constructor(createItem, items = undefined) {
    	          super(items);
    	          this.createItem = createItem;
    	        }

    	        get(key) {
    	          if (!this.has(key)) {
    	            this.set(key, this.createItem(key));
    	          }

    	          return super.get(key);
    	        }

    	      }
    	      /**
    	       * Returns true if the given object is an object with a `then` method, and can
    	       * therefore be assumed to behave as a Promise.
    	       *
    	       * @param {*} value The value to test.
    	       * @returns {boolean} True if the value is thenable.
    	       */


    	      const isThenable = value => {
    	        return value && typeof value === "object" && typeof value.then === "function";
    	      };
    	      /**
    	       * Creates and returns a function which, when called, will resolve or reject
    	       * the given promise based on how it is called:
    	       *
    	       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
    	       *   the promise is rejected with that value.
    	       * - If the function is called with exactly one argument, the promise is
    	       *   resolved to that value.
    	       * - Otherwise, the promise is resolved to an array containing all of the
    	       *   function's arguments.
    	       *
    	       * @param {object} promise
    	       *        An object containing the resolution and rejection functions of a
    	       *        promise.
    	       * @param {function} promise.resolve
    	       *        The promise's resolution function.
    	       * @param {function} promise.reject
    	       *        The promise's rejection function.
    	       * @param {object} metadata
    	       *        Metadata about the wrapped method which has created the callback.
    	       * @param {boolean} metadata.singleCallbackArg
    	       *        Whether or not the promise is resolved with only the first
    	       *        argument of the callback, alternatively an array of all the
    	       *        callback arguments is resolved. By default, if the callback
    	       *        function is invoked with only a single argument, that will be
    	       *        resolved to the promise, while all arguments will be resolved as
    	       *        an array if multiple are given.
    	       *
    	       * @returns {function}
    	       *        The generated callback function.
    	       */


    	      const makeCallback = (promise, metadata) => {
    	        return (...callbackArgs) => {
    	          if (extensionAPIs.runtime.lastError) {
    	            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
    	          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
    	            promise.resolve(callbackArgs[0]);
    	          } else {
    	            promise.resolve(callbackArgs);
    	          }
    	        };
    	      };

    	      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
    	      /**
    	       * Creates a wrapper function for a method with the given name and metadata.
    	       *
    	       * @param {string} name
    	       *        The name of the method which is being wrapped.
    	       * @param {object} metadata
    	       *        Metadata about the method being wrapped.
    	       * @param {integer} metadata.minArgs
    	       *        The minimum number of arguments which must be passed to the
    	       *        function. If called with fewer than this number of arguments, the
    	       *        wrapper will raise an exception.
    	       * @param {integer} metadata.maxArgs
    	       *        The maximum number of arguments which may be passed to the
    	       *        function. If called with more than this number of arguments, the
    	       *        wrapper will raise an exception.
    	       * @param {boolean} metadata.singleCallbackArg
    	       *        Whether or not the promise is resolved with only the first
    	       *        argument of the callback, alternatively an array of all the
    	       *        callback arguments is resolved. By default, if the callback
    	       *        function is invoked with only a single argument, that will be
    	       *        resolved to the promise, while all arguments will be resolved as
    	       *        an array if multiple are given.
    	       *
    	       * @returns {function(object, ...*)}
    	       *       The generated wrapper function.
    	       */


    	      const wrapAsyncFunction = (name, metadata) => {
    	        return function asyncFunctionWrapper(target, ...args) {
    	          if (args.length < metadata.minArgs) {
    	            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
    	          }

    	          if (args.length > metadata.maxArgs) {
    	            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
    	          }

    	          return new Promise((resolve, reject) => {
    	            if (metadata.fallbackToNoCallback) {
    	              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
    	              // and so the polyfill will try to call it with a callback first, and it will fallback
    	              // to not passing the callback if the first call fails.
    	              try {
    	                target[name](...args, makeCallback({
    	                  resolve,
    	                  reject
    	                }, metadata));
    	              } catch (cbError) {
    	                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
    	                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
    	                // use the unsupported callback anymore.

    	                metadata.fallbackToNoCallback = false;
    	                metadata.noCallback = true;
    	                resolve();
    	              }
    	            } else if (metadata.noCallback) {
    	              target[name](...args);
    	              resolve();
    	            } else {
    	              target[name](...args, makeCallback({
    	                resolve,
    	                reject
    	              }, metadata));
    	            }
    	          });
    	        };
    	      };
    	      /**
    	       * Wraps an existing method of the target object, so that calls to it are
    	       * intercepted by the given wrapper function. The wrapper function receives,
    	       * as its first argument, the original `target` object, followed by each of
    	       * the arguments passed to the original method.
    	       *
    	       * @param {object} target
    	       *        The original target object that the wrapped method belongs to.
    	       * @param {function} method
    	       *        The method being wrapped. This is used as the target of the Proxy
    	       *        object which is created to wrap the method.
    	       * @param {function} wrapper
    	       *        The wrapper function which is called in place of a direct invocation
    	       *        of the wrapped method.
    	       *
    	       * @returns {Proxy<function>}
    	       *        A Proxy object for the given method, which invokes the given wrapper
    	       *        method in its place.
    	       */


    	      const wrapMethod = (target, method, wrapper) => {
    	        return new Proxy(method, {
    	          apply(targetMethod, thisObj, args) {
    	            return wrapper.call(thisObj, target, ...args);
    	          }

    	        });
    	      };

    	      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
    	      /**
    	       * Wraps an object in a Proxy which intercepts and wraps certain methods
    	       * based on the given `wrappers` and `metadata` objects.
    	       *
    	       * @param {object} target
    	       *        The target object to wrap.
    	       *
    	       * @param {object} [wrappers = {}]
    	       *        An object tree containing wrapper functions for special cases. Any
    	       *        function present in this object tree is called in place of the
    	       *        method in the same location in the `target` object tree. These
    	       *        wrapper methods are invoked as described in {@see wrapMethod}.
    	       *
    	       * @param {object} [metadata = {}]
    	       *        An object tree containing metadata used to automatically generate
    	       *        Promise-based wrapper functions for asynchronous. Any function in
    	       *        the `target` object tree which has a corresponding metadata object
    	       *        in the same location in the `metadata` tree is replaced with an
    	       *        automatically-generated wrapper function, as described in
    	       *        {@see wrapAsyncFunction}
    	       *
    	       * @returns {Proxy<object>}
    	       */

    	      const wrapObject = (target, wrappers = {}, metadata = {}) => {
    	        let cache = Object.create(null);
    	        let handlers = {
    	          has(proxyTarget, prop) {
    	            return prop in target || prop in cache;
    	          },

    	          get(proxyTarget, prop, receiver) {
    	            if (prop in cache) {
    	              return cache[prop];
    	            }

    	            if (!(prop in target)) {
    	              return undefined;
    	            }

    	            let value = target[prop];

    	            if (typeof value === "function") {
    	              // This is a method on the underlying object. Check if we need to do
    	              // any wrapping.
    	              if (typeof wrappers[prop] === "function") {
    	                // We have a special-case wrapper for this method.
    	                value = wrapMethod(target, target[prop], wrappers[prop]);
    	              } else if (hasOwnProperty(metadata, prop)) {
    	                // This is an async method that we have metadata for. Create a
    	                // Promise wrapper for it.
    	                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
    	                value = wrapMethod(target, target[prop], wrapper);
    	              } else {
    	                // This is a method that we don't know or care about. Return the
    	                // original method, bound to the underlying object.
    	                value = value.bind(target);
    	              }
    	            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
    	              // This is an object that we need to do some wrapping for the children
    	              // of. Create a sub-object wrapper for it with the appropriate child
    	              // metadata.
    	              value = wrapObject(value, wrappers[prop], metadata[prop]);
    	            } else if (hasOwnProperty(metadata, "*")) {
    	              // Wrap all properties in * namespace.
    	              value = wrapObject(value, wrappers[prop], metadata["*"]);
    	            } else {
    	              // We don't need to do any wrapping for this property,
    	              // so just forward all access to the underlying object.
    	              Object.defineProperty(cache, prop, {
    	                configurable: true,
    	                enumerable: true,

    	                get() {
    	                  return target[prop];
    	                },

    	                set(value) {
    	                  target[prop] = value;
    	                }

    	              });
    	              return value;
    	            }

    	            cache[prop] = value;
    	            return value;
    	          },

    	          set(proxyTarget, prop, value, receiver) {
    	            if (prop in cache) {
    	              cache[prop] = value;
    	            } else {
    	              target[prop] = value;
    	            }

    	            return true;
    	          },

    	          defineProperty(proxyTarget, prop, desc) {
    	            return Reflect.defineProperty(cache, prop, desc);
    	          },

    	          deleteProperty(proxyTarget, prop) {
    	            return Reflect.deleteProperty(cache, prop);
    	          }

    	        }; // Per contract of the Proxy API, the "get" proxy handler must return the
    	        // original value of the target if that value is declared read-only and
    	        // non-configurable. For this reason, we create an object with the
    	        // prototype set to `target` instead of using `target` directly.
    	        // Otherwise we cannot return a custom object for APIs that
    	        // are declared read-only and non-configurable, such as `chrome.devtools`.
    	        //
    	        // The proxy handlers themselves will still use the original `target`
    	        // instead of the `proxyTarget`, so that the methods and properties are
    	        // dereferenced via the original targets.

    	        let proxyTarget = Object.create(target);
    	        return new Proxy(proxyTarget, handlers);
    	      };
    	      /**
    	       * Creates a set of wrapper functions for an event object, which handles
    	       * wrapping of listener functions that those messages are passed.
    	       *
    	       * A single wrapper is created for each listener function, and stored in a
    	       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
    	       * retrieve the original wrapper, so that  attempts to remove a
    	       * previously-added listener work as expected.
    	       *
    	       * @param {DefaultWeakMap<function, function>} wrapperMap
    	       *        A DefaultWeakMap object which will create the appropriate wrapper
    	       *        for a given listener function when one does not exist, and retrieve
    	       *        an existing one when it does.
    	       *
    	       * @returns {object}
    	       */


    	      const wrapEvent = wrapperMap => ({
    	        addListener(target, listener, ...args) {
    	          target.addListener(wrapperMap.get(listener), ...args);
    	        },

    	        hasListener(target, listener) {
    	          return target.hasListener(wrapperMap.get(listener));
    	        },

    	        removeListener(target, listener) {
    	          target.removeListener(wrapperMap.get(listener));
    	        }

    	      });

    	      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
    	        if (typeof listener !== "function") {
    	          return listener;
    	        }
    	        /**
    	         * Wraps an onRequestFinished listener function so that it will return a
    	         * `getContent()` property which returns a `Promise` rather than using a
    	         * callback API.
    	         *
    	         * @param {object} req
    	         *        The HAR entry object representing the network request.
    	         */


    	        return function onRequestFinished(req) {
    	          const wrappedReq = wrapObject(req, {}
    	          /* wrappers */
    	          , {
    	            getContent: {
    	              minArgs: 0,
    	              maxArgs: 0
    	            }
    	          });
    	          listener(wrappedReq);
    	        };
    	      }); // Keep track if the deprecation warning has been logged at least once.

    	      let loggedSendResponseDeprecationWarning = false;
    	      const onMessageWrappers = new DefaultWeakMap(listener => {
    	        if (typeof listener !== "function") {
    	          return listener;
    	        }
    	        /**
    	         * Wraps a message listener function so that it may send responses based on
    	         * its return value, rather than by returning a sentinel value and calling a
    	         * callback. If the listener function returns a Promise, the response is
    	         * sent when the promise either resolves or rejects.
    	         *
    	         * @param {*} message
    	         *        The message sent by the other end of the channel.
    	         * @param {object} sender
    	         *        Details about the sender of the message.
    	         * @param {function(*)} sendResponse
    	         *        A callback which, when called with an arbitrary argument, sends
    	         *        that value as a response.
    	         * @returns {boolean}
    	         *        True if the wrapped listener returned a Promise, which will later
    	         *        yield a response. False otherwise.
    	         */


    	        return function onMessage(message, sender, sendResponse) {
    	          let didCallSendResponse = false;
    	          let wrappedSendResponse;
    	          let sendResponsePromise = new Promise(resolve => {
    	            wrappedSendResponse = function (response) {
    	              if (!loggedSendResponseDeprecationWarning) {
    	                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
    	                loggedSendResponseDeprecationWarning = true;
    	              }

    	              didCallSendResponse = true;
    	              resolve(response);
    	            };
    	          });
    	          let result;

    	          try {
    	            result = listener(message, sender, wrappedSendResponse);
    	          } catch (err) {
    	            result = Promise.reject(err);
    	          }

    	          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
    	          // wrappedSendResponse synchronously, we can exit earlier
    	          // because there will be no response sent from this listener.

    	          if (result !== true && !isResultThenable && !didCallSendResponse) {
    	            return false;
    	          } // A small helper to send the message if the promise resolves
    	          // and an error if the promise rejects (a wrapped sendMessage has
    	          // to translate the message into a resolved promise or a rejected
    	          // promise).


    	          const sendPromisedResult = promise => {
    	            promise.then(msg => {
    	              // send the message value.
    	              sendResponse(msg);
    	            }, error => {
    	              // Send a JSON representation of the error if the rejected value
    	              // is an instance of error, or the object itself otherwise.
    	              let message;

    	              if (error && (error instanceof Error || typeof error.message === "string")) {
    	                message = error.message;
    	              } else {
    	                message = "An unexpected error occurred";
    	              }

    	              sendResponse({
    	                __mozWebExtensionPolyfillReject__: true,
    	                message
    	              });
    	            }).catch(err => {
    	              // Print an error on the console if unable to send the response.
    	              console.error("Failed to send onMessage rejected reply", err);
    	            });
    	          }; // If the listener returned a Promise, send the resolved value as a
    	          // result, otherwise wait the promise related to the wrappedSendResponse
    	          // callback to resolve and send it as a response.


    	          if (isResultThenable) {
    	            sendPromisedResult(result);
    	          } else {
    	            sendPromisedResult(sendResponsePromise);
    	          } // Let Chrome know that the listener is replying.


    	          return true;
    	        };
    	      });

    	      const wrappedSendMessageCallback = ({
    	        reject,
    	        resolve
    	      }, reply) => {
    	        if (extensionAPIs.runtime.lastError) {
    	          // Detect when none of the listeners replied to the sendMessage call and resolve
    	          // the promise to undefined as in Firefox.
    	          // See https://github.com/mozilla/webextension-polyfill/issues/130
    	          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
    	            resolve();
    	          } else {
    	            reject(new Error(extensionAPIs.runtime.lastError.message));
    	          }
    	        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
    	          // Convert back the JSON representation of the error into
    	          // an Error instance.
    	          reject(new Error(reply.message));
    	        } else {
    	          resolve(reply);
    	        }
    	      };

    	      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
    	        if (args.length < metadata.minArgs) {
    	          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
    	        }

    	        if (args.length > metadata.maxArgs) {
    	          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
    	        }

    	        return new Promise((resolve, reject) => {
    	          const wrappedCb = wrappedSendMessageCallback.bind(null, {
    	            resolve,
    	            reject
    	          });
    	          args.push(wrappedCb);
    	          apiNamespaceObj.sendMessage(...args);
    	        });
    	      };

    	      const staticWrappers = {
    	        devtools: {
    	          network: {
    	            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
    	          }
    	        },
    	        runtime: {
    	          onMessage: wrapEvent(onMessageWrappers),
    	          onMessageExternal: wrapEvent(onMessageWrappers),
    	          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
    	            minArgs: 1,
    	            maxArgs: 3
    	          })
    	        },
    	        tabs: {
    	          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
    	            minArgs: 2,
    	            maxArgs: 3
    	          })
    	        }
    	      };
    	      const settingMetadata = {
    	        clear: {
    	          minArgs: 1,
    	          maxArgs: 1
    	        },
    	        get: {
    	          minArgs: 1,
    	          maxArgs: 1
    	        },
    	        set: {
    	          minArgs: 1,
    	          maxArgs: 1
    	        }
    	      };
    	      apiMetadata.privacy = {
    	        network: {
    	          "*": settingMetadata
    	        },
    	        services: {
    	          "*": settingMetadata
    	        },
    	        websites: {
    	          "*": settingMetadata
    	        }
    	      };
    	      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    	    }; // The build process adds a UMD wrapper around this file, which makes the
    	    // `module` variable available.


    	    module.exports = wrapAPIs(chrome);
    	  } else {
    	    module.exports = globalThis.browser;
    	  }
    	});
    	
    } (browserPolyfill));

    var chromePolyfill = browserPolyfill.exports;

    async function polyfill(fn) {
        if(isFirefox) {
            globalThis.chrome = chromePolyfill;
            // action is called browserAction in manifest v2
            chrome.action = chrome.browserAction;
        }
        await fn();
    }

    class MapSet extends Map {
      set(key, value) {
        super.set(key, value);
        return value;
      }
    }

    class WeakMapSet extends WeakMap {
      set(key, value) {
        super.set(key, value);
        return value;
      }
    }

    const {isArray: isArray$2} = Array;

    const sync = (values, i) => {
      const resolved = [];
      for (const {length} = values; i < length; i++)
        resolved.push(isArray$2(values[i]) ? sync(values[i], 0) : values[i]);
      return Promise.all(resolved);
    };

    /**
     * Returns a template literal tag abe to resolve, recursively, any possible
     * asynchronous interpolation.
     * @param {function} tag a template literal tag.
     * @returns {function} a template literal tag that resolves interpolations
     *                     before passing these to the initial template literal.
     */
    var asyncTag = tag => {
      function invoke(template, values) {
        return tag.apply(this, [template].concat(values));
      }
      return function (template) {
        return sync(arguments, 1).then(invoke.bind(this, template));
      };
    };

    /*! (c) Andrea Giammarchi - ISC */
    const empty = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
    const elements = /<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/?)>/g;
    const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
    const holes = /[\x01\x02]/g;

    // \x01 Node.ELEMENT_NODE
    // \x02 Node.ATTRIBUTE_NODE

    /**
     * Given a template, find holes as both nodes and attributes and
     * return a string with holes as either comment nodes or named attributes.
     * @param {string[]} template a template literal tag array
     * @param {string} prefix prefix to use per each comment/attribute
     * @param {boolean} svg enforces self-closing tags
     * @returns {string} X/HTML with prefixed comments or attributes
     */
    var instrument = (template, prefix, svg) => {
      let i = 0;
      return template
              .join('\x01')
              .trim()
              .replace(
                elements,
                (_, name, attrs, selfClosing) => {
                  let ml = name + attrs.replace(attributes, '\x02=$2$1').trimEnd();
                  if (selfClosing.length)
                    ml += (svg || empty.test(name)) ? ' /' : ('></' + name);
                  return '<' + ml + '>';
                }
              )
              .replace(
                holes,
                hole => hole === '\x01' ?
                  ('<!--' + prefix + i++ + '-->') :
                  (prefix + i++)
              );
    };

    const ELEMENT_NODE = 1;
    const nodeType = 111;

    const remove = ({firstChild, lastChild}) => {
      const range = document.createRange();
      range.setStartAfter(firstChild);
      range.setEndAfter(lastChild);
      range.deleteContents();
      return firstChild;
    };

    const diffable = (node, operation) => node.nodeType === nodeType ?
      ((1 / operation) < 0 ?
        (operation ? remove(node) : node.lastChild) :
        (operation ? node.valueOf() : node.firstChild)) :
      node
    ;

    const persistent = fragment => {
      const {firstChild, lastChild} = fragment;
      if (firstChild === lastChild)
        return lastChild || fragment;
      const {childNodes} = fragment;
      const nodes = [...childNodes];
      return {
        ELEMENT_NODE,
        nodeType,
        firstChild,
        lastChild,
        valueOf() {
          if (childNodes.length !== nodes.length)
            fragment.append(...nodes);
          return fragment;
        }
      };
    };

    const {isArray: isArray$1} = Array;

    const aria = node => values => {
      for (const key in values) {
        const name = key === 'role' ? key : `aria-${key}`;
        const value = values[key];
        if (value == null)
          node.removeAttribute(name);
        else
          node.setAttribute(name, value);
      }
    };

    const attribute = (node, name) => {
      let oldValue, orphan = true;
      const attributeNode = document.createAttributeNS(null, name);
      return newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (oldValue == null) {
            if (!orphan) {
              node.removeAttributeNode(attributeNode);
              orphan = true;
            }
          }
          else {
            const value = newValue;
            if (value == null) {
              if (!orphan)
                node.removeAttributeNode(attributeNode);
                orphan = true;
            }
            else {
              attributeNode.value = value;
              if (orphan) {
                node.setAttributeNodeNS(attributeNode);
                orphan = false;
              }
            }
          }
        }
      };
    };

    const boolean = (node, key, oldValue) => newValue => {
      if (oldValue !== !!newValue) {
        // when IE won't be around anymore ...
        // node.toggleAttribute(key, oldValue = !!newValue);
        if ((oldValue = !!newValue))
          node.setAttribute(key, '');
        else
          node.removeAttribute(key);
      }
    };

    const data = ({dataset}) => values => {
      for (const key in values) {
        const value = values[key];
        if (value == null)
          delete dataset[key];
        else
          dataset[key] = value;
      }
    };

    const event = (node, name) => {
      let oldValue, lower, type = name.slice(2);
      if (!(name in node) && (lower = name.toLowerCase()) in node)
        type = lower.slice(2);
      return newValue => {
        const info = isArray$1(newValue) ? newValue : [newValue, false];
        if (oldValue !== info[0]) {
          if (oldValue)
            node.removeEventListener(type, oldValue, info[1]);
          if (oldValue = info[0])
            node.addEventListener(type, oldValue, info[1]);
        }
      };
    };

    const ref = node => {
      let oldValue;
      return value => {
        if (oldValue !== value) {
          oldValue = value;
          if (typeof value === 'function')
            value(node);
          else
            value.current = node;
        }
      };
    };

    const setter = (node, key) => key === 'dataset' ?
      data(node) :
      value => {
        node[key] = value;
      };

    const text = node => {
      let oldValue;
      return newValue => {
        if (oldValue != newValue) {
          oldValue = newValue;
          node.textContent = newValue == null ? '' : newValue;
        }
      };
    };

    /**
     * ISC License
     *
     * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
     * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
     * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
     * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
     * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
     * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
     * PERFORMANCE OF THIS SOFTWARE.
     */

    /**
     * @param {Node} parentNode The container where children live
     * @param {Node[]} a The list of current/live children
     * @param {Node[]} b The list of future children
     * @param {(entry: Node, action: number) => Node} get
     * The callback invoked per each entry related DOM operation.
     * @param {Node} [before] The optional node used as anchor to insert before.
     * @returns {Node[]} The same list of future children.
     */
    var udomdiff = (parentNode, a, b, get, before) => {
      const bLength = b.length;
      let aEnd = a.length;
      let bEnd = bLength;
      let aStart = 0;
      let bStart = 0;
      let map = null;
      while (aStart < aEnd || bStart < bEnd) {
        // append head, tail, or nodes in between: fast path
        if (aEnd === aStart) {
          // we could be in a situation where the rest of nodes that
          // need to be added are not at the end, and in such case
          // the node to `insertBefore`, if the index is more than 0
          // must be retrieved, otherwise it's gonna be the first item.
          const node = bEnd < bLength ?
            (bStart ?
              (get(b[bStart - 1], -0).nextSibling) :
              get(b[bEnd - bStart], 0)) :
            before;
          while (bStart < bEnd)
            parentNode.insertBefore(get(b[bStart++], 1), node);
        }
        // remove head or tail: fast path
        else if (bEnd === bStart) {
          while (aStart < aEnd) {
            // remove the node only if it's unknown or not live
            if (!map || !map.has(a[aStart]))
              parentNode.removeChild(get(a[aStart], -1));
            aStart++;
          }
        }
        // same node: fast path
        else if (a[aStart] === b[bStart]) {
          aStart++;
          bStart++;
        }
        // same tail: fast path
        else if (a[aEnd - 1] === b[bEnd - 1]) {
          aEnd--;
          bEnd--;
        }
        // The once here single last swap "fast path" has been removed in v1.1.0
        // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
        // reverse swap: also fast path
        else if (
          a[aStart] === b[bEnd - 1] &&
          b[bStart] === a[aEnd - 1]
        ) {
          // this is a "shrink" operation that could happen in these cases:
          // [1, 2, 3, 4, 5]
          // [1, 4, 3, 2, 5]
          // or asymmetric too
          // [1, 2, 3, 4, 5]
          // [1, 2, 3, 5, 6, 4]
          const node = get(a[--aEnd], -1).nextSibling;
          parentNode.insertBefore(
            get(b[bStart++], 1),
            get(a[aStart++], -1).nextSibling
          );
          parentNode.insertBefore(get(b[--bEnd], 1), node);
          // mark the future index as identical (yeah, it's dirty, but cheap 👍)
          // The main reason to do this, is that when a[aEnd] will be reached,
          // the loop will likely be on the fast path, as identical to b[bEnd].
          // In the best case scenario, the next loop will skip the tail,
          // but in the worst one, this node will be considered as already
          // processed, bailing out pretty quickly from the map index check
          a[aEnd] = b[bEnd];
        }
        // map based fallback, "slow" path
        else {
          // the map requires an O(bEnd - bStart) operation once
          // to store all future nodes indexes for later purposes.
          // In the worst case scenario, this is a full O(N) cost,
          // and such scenario happens at least when all nodes are different,
          // but also if both first and last items of the lists are different
          if (!map) {
            map = new Map;
            let i = bStart;
            while (i < bEnd)
              map.set(b[i], i++);
          }
          // if it's a future node, hence it needs some handling
          if (map.has(a[aStart])) {
            // grab the index of such node, 'cause it might have been processed
            const index = map.get(a[aStart]);
            // if it's not already processed, look on demand for the next LCS
            if (bStart < index && index < bEnd) {
              let i = aStart;
              // counts the amount of nodes that are the same in the future
              let sequence = 1;
              while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
                sequence++;
              // effort decision here: if the sequence is longer than replaces
              // needed to reach such sequence, which would brings again this loop
              // to the fast path, prepend the difference before a sequence,
              // and move only the future list index forward, so that aStart
              // and bStart will be aligned again, hence on the fast path.
              // An example considering aStart and bStart are both 0:
              // a: [1, 2, 3, 4]
              // b: [7, 1, 2, 3, 6]
              // this would place 7 before 1 and, from that time on, 1, 2, and 3
              // will be processed at zero cost
              if (sequence > (index - bStart)) {
                const node = get(a[aStart], 0);
                while (bStart < index)
                  parentNode.insertBefore(get(b[bStart++], 1), node);
              }
              // if the effort wasn't good enough, fallback to a replace,
              // moving both source and target indexes forward, hoping that some
              // similar node will be found later on, to go back to the fast path
              else {
                parentNode.replaceChild(
                  get(b[bStart++], 1),
                  get(a[aStart++], -1)
                );
              }
            }
            // otherwise move the source forward, 'cause there's nothing to do
            else
              aStart++;
          }
          // this node has no meaning in the future list, so it's more than safe
          // to remove it, and check the next live node out instead, meaning
          // that only the live list index should be forwarded
          else
            parentNode.removeChild(get(a[aStart++], -1));
        }
      }
      return b;
    };

    const {isArray, prototype} = Array;
    const {indexOf} = prototype;

    const {
      createDocumentFragment,
      createElement,
      createElementNS,
      createTextNode,
      createTreeWalker,
      importNode
    } = new Proxy(document, {
      get: (target, method) => target[method].bind(target)
    });

    const createHTML = html => {
      const template = createElement('template');
      template.innerHTML = html;
      return template.content;
    };

    let xml;
    const createSVG = svg => {
      if (!xml) xml = createElementNS('http://www.w3.org/2000/svg', 'svg');
      xml.innerHTML = svg;
      const content = createDocumentFragment();
      content.append(...xml.childNodes);
      return content;
    };

    const createContent = (text, svg) => svg ?
                                  createSVG(text) : createHTML(text);

    // from a generic path, retrieves the exact targeted node
    const reducePath = ({childNodes}, i) => childNodes[i];

    // this helper avoid code bloat around handleAnything() callback
    const diff = (comment, oldNodes, newNodes) => udomdiff(
      comment.parentNode,
      // TODO: there is a possible edge case where a node has been
      //       removed manually, or it was a keyed one, attached
      //       to a shared reference between renders.
      //       In this case udomdiff might fail at removing such node
      //       as its parent won't be the expected one.
      //       The best way to avoid this issue is to filter oldNodes
      //       in search of those not live, or not in the current parent
      //       anymore, but this would require both a change to uwire,
      //       exposing a parentNode from the firstChild, as example,
      //       but also a filter per each diff that should exclude nodes
      //       that are not in there, penalizing performance quite a lot.
      //       As this has been also a potential issue with domdiff,
      //       and both lighterhtml and hyperHTML might fail with this
      //       very specific edge case, I might as well document this possible
      //       "diffing shenanigan" and call it a day.
      oldNodes,
      newNodes,
      diffable,
      comment
    );

    // if an interpolation represents a comment, the whole
    // diffing will be related to such comment.
    // This helper is in charge of understanding how the new
    // content for such interpolation/hole should be updated
    const handleAnything = comment => {
      let oldValue, text, nodes = [];
      const anyContent = newValue => {
        switch (typeof newValue) {
          // primitives are handled as text content
          case 'string':
          case 'number':
          case 'boolean':
            if (oldValue !== newValue) {
              oldValue = newValue;
              if (!text)
                text = createTextNode('');
              text.data = newValue;
              nodes = diff(comment, nodes, [text]);
            }
            break;
          // null, and undefined are used to cleanup previous content
          case 'object':
          case 'undefined':
            if (newValue == null) {
              if (oldValue != newValue) {
                oldValue = newValue;
                nodes = diff(comment, nodes, []);
              }
              break;
            }
            // arrays and nodes have a special treatment
            if (isArray(newValue)) {
              oldValue = newValue;
              // arrays can be used to cleanup, if empty
              if (newValue.length === 0)
                nodes = diff(comment, nodes, []);
              // or diffed, if these contains nodes or "wires"
              else if (typeof newValue[0] === 'object')
                nodes = diff(comment, nodes, newValue);
              // in all other cases the content is stringified as is
              else
                anyContent(String(newValue));
              break;
            }
            // if the new value is a DOM node, or a wire, and it's
            // different from the one already live, then it's diffed.
            // if the node is a fragment, it's appended once via its childNodes
            // There is no `else` here, meaning if the content
            // is not expected one, nothing happens, as easy as that.
            if (oldValue !== newValue && 'ELEMENT_NODE' in newValue) {
              oldValue = newValue;
              nodes = diff(
                comment,
                nodes,
                newValue.nodeType === 11 ?
                  [...newValue.childNodes] :
                  [newValue]
              );
            }
            break;
          case 'function':
            anyContent(newValue(comment));
            break;
        }
      };
      return anyContent;
    };

    // attributes can be:
    //  * ref=${...}      for hooks and other purposes
    //  * aria=${...}     for aria attributes
    //  * ?boolean=${...} for boolean attributes
    //  * .dataset=${...} for dataset related attributes
    //  * .setter=${...}  for Custom Elements setters or nodes with setters
    //                    such as buttons, details, options, select, etc
    //  * @event=${...}   to explicitly handle event listeners
    //  * onevent=${...}  to automatically handle event listeners
    //  * generic=${...}  to handle an attribute just like an attribute
    const handleAttribute = (node, name/*, svg*/) => {
      switch (name[0]) {
        case '?': return boolean(node, name.slice(1), false);
        case '.': return setter(node, name.slice(1));
        case '@': return event(node, 'on' + name.slice(1));
        case 'o': if (name[1] === 'n') return event(node, name);
      }

      switch (name) {
        case 'ref': return ref(node);
        case 'aria': return aria(node);
      }

      return attribute(node, name/*, svg*/);
    };

    // each mapped update carries the update type and its path
    // the type is either node, attribute, or text, while
    // the path is how to retrieve the related node to update.
    // In the attribute case, the attribute name is also carried along.
    function handlers(options) {
      const {type, path} = options;
      const node = path.reduceRight(reducePath, this);
      return type === 'node' ?
        handleAnything(node) :
        (type === 'attr' ?
          handleAttribute(node, options.name/*, options.svg*/) :
          text(node));
    }

    // from a fragment container, create an array of indexes
    // related to its child nodes, so that it's possible
    // to retrieve later on exact node via reducePath
    const createPath = node => {
      const path = [];
      let {parentNode} = node;
      while (parentNode) {
        path.push(indexOf.call(parentNode.childNodes, node));
        node = parentNode;
        ({parentNode} = node);
      }
      return path;
    };

    // the prefix is used to identify either comments, attributes, or nodes
    // that contain the related unique id. In the attribute cases
    // isµX="attribute-name" will be used to map current X update to that
    // attribute name, while comments will be like <!--isµX-->, to map
    // the update to that specific comment node, hence its parent.
    // style and textarea will have <!--isµX--> text content, and are handled
    // directly through text-only updates.
    const prefix = 'isµ';

    // Template Literals are unique per scope and static, meaning a template
    // should be parsed once, and once only, as it will always represent the same
    // content, within the exact same amount of updates each time.
    // This cache relates each template to its unique content and updates.
    const cache$1 = new WeakMapSet;

    // a RegExp that helps checking nodes that cannot contain comments
    const textOnly = /^(?:textarea|script|style|title|plaintext|xmp)$/;

    const createCache = () => ({
      stack: [],    // each template gets a stack for each interpolation "hole"

      entry: null,  // each entry contains details, such as:
                    //  * the template that is representing
                    //  * the type of node it represents (html or svg)
                    //  * the content fragment with all nodes
                    //  * the list of updates per each node (template holes)
                    //  * the "wired" node or fragment that will get updates
                    // if the template or type are different from the previous one
                    // the entry gets re-created each time

      wire: null    // each rendered node represent some wired content and
                    // this reference to the latest one. If different, the node
                    // will be cleaned up and the new "wire" will be appended
    });

    // the entry stored in the rendered node cache, and per each "hole"
    const createEntry = (type, template) => {
      const {content, updates} = mapUpdates(type, template);
      return {type, template, content, updates, wire: null};
    };

    // a template is instrumented to be able to retrieve where updates are needed.
    // Each unique template becomes a fragment, cloned once per each other
    // operation based on the same template, i.e. data => html`<p>${data}</p>`
    const mapTemplate = (type, template) => {
      const svg = type === 'svg';
      const text = instrument(template, prefix, svg);
      const content = createContent(text, svg);
      // once instrumented and reproduced as fragment, it's crawled
      // to find out where each update is in the fragment tree
      const tw = createTreeWalker(content, 1 | 128);
      const nodes = [];
      const length = template.length - 1;
      let i = 0;
      // updates are searched via unique names, linearly increased across the tree
      // <div isµ0="attr" isµ1="other"><!--isµ2--><style><!--isµ3--</style></div>
      let search = `${prefix}${i}`;
      while (i < length) {
        const node = tw.nextNode();
        // if not all updates are bound but there's nothing else to crawl
        // it means that there is something wrong with the template.
        if (!node)
          throw `bad template: ${text}`;
        // if the current node is a comment, and it contains isµX
        // it means the update should take care of any content
        if (node.nodeType === 8) {
          // The only comments to be considered are those
          // which content is exactly the same as the searched one.
          if (node.data === search) {
            nodes.push({type: 'node', path: createPath(node)});
            search = `${prefix}${++i}`;
          }
        }
        else {
          // if the node is not a comment, loop through all its attributes
          // named isµX and relate attribute updates to this node and the
          // attribute name, retrieved through node.getAttribute("isµX")
          // the isµX attribute will be removed as irrelevant for the layout
          // let svg = -1;
          while (node.hasAttribute(search)) {
            nodes.push({
              type: 'attr',
              path: createPath(node),
              name: node.getAttribute(search)
            });
            node.removeAttribute(search);
            search = `${prefix}${++i}`;
          }
          // if the node was a style, textarea, or others, check its content
          // and if it is <!--isµX--> then update tex-only this node
          if (
            textOnly.test(node.localName) &&
            node.textContent.trim() === `<!--${search}-->`
          ){
            node.textContent = '';
            nodes.push({type: 'text', path: createPath(node)});
            search = `${prefix}${++i}`;
          }
        }
      }
      // once all nodes to update, or their attributes, are known, the content
      // will be cloned in the future to represent the template, and all updates
      // related to such content retrieved right away without needing to re-crawl
      // the exact same template, and its content, more than once.
      return {content, nodes};
    };

    // if a template is unknown, perform the previous mapping, otherwise grab
    // its details such as the fragment with all nodes, and updates info.
    const mapUpdates = (type, template) => {
      const {content, nodes} = (
        cache$1.get(template) ||
        cache$1.set(template, mapTemplate(type, template))
      );
      // clone deeply the fragment
      const fragment = importNode(content, true);
      // and relate an update handler per each node that needs one
      const updates = nodes.map(handlers, fragment);
      // return the fragment and all updates to use within its nodes
      return {content: fragment, updates};
    };

    // as html and svg can be nested calls, but no parent node is known
    // until rendered somewhere, the unroll operation is needed to
    // discover what to do with each interpolation, which will result
    // into an update operation.
    const unroll = (info, {type, template, values}) => {
      // interpolations can contain holes and arrays, so these need
      // to be recursively discovered
      const length = unrollValues(info, values);
      let {entry} = info;
      // if the cache entry is either null or different from the template
      // and the type this unroll should resolve, create a new entry
      // assigning a new content fragment and the list of updates.
      if (!entry || (entry.template !== template || entry.type !== type))
        info.entry = (entry = createEntry(type, template));
      const {content, updates, wire} = entry;
      // even if the fragment and its nodes is not live yet,
      // it is already possible to update via interpolations values.
      for (let i = 0; i < length; i++)
        updates[i](values[i]);
      // if the entry was new, or representing a different template or type,
      // create a new persistent entity to use during diffing.
      // This is simply a DOM node, when the template has a single container,
      // as in `<p></p>`, or a "wire" in `<p></p><p></p>` and similar cases.
      return wire || (entry.wire = persistent(content));
    };

    // the stack retains, per each interpolation value, the cache
    // related to each interpolation value, or null, if the render
    // was conditional and the value is not special (Array or Hole)
    const unrollValues = ({stack}, values) => {
      const {length} = values;
      for (let i = 0; i < length; i++) {
        const hole = values[i];
        // each Hole gets unrolled and re-assigned as value
        // so that domdiff will deal with a node/wire, not with a hole
        if (hole instanceof Hole)
          values[i] = unroll(
            stack[i] || (stack[i] = createCache()),
            hole
          );
        // arrays are recursively resolved so that each entry will contain
        // also a DOM node or a wire, hence it can be diffed if/when needed
        else if (isArray(hole))
          unrollValues(stack[i] || (stack[i] = createCache()), hole);
        // if the value is nothing special, the stack doesn't need to retain data
        // this is useful also to cleanup previously retained data, if the value
        // was a Hole, or an Array, but not anymore, i.e.:
        // const update = content => html`<div>${content}</div>`;
        // update(listOfItems); update(null); update(html`hole`)
        else
          stack[i] = null;
      }
      if (length < stack.length)
        stack.splice(length);
      return length;
    };

    /**
     * Holds all details wrappers needed to render the content further on.
     * @constructor
     * @param {string} type The hole type, either `html` or `svg`.
     * @param {string[]} template The template literals used to the define the content.
     * @param {Array} values Zero, one, or more interpolated values to render.
     */
    class Hole {
      constructor(type, template, values) {
        this.type = type;
        this.template = template;
        this.values = values;
      }
    }

    // both `html` and `svg` template literal tags are polluted
    // with a `for(ref[, id])` and a `node` tag too
    const tag$1 = type => {
      // both `html` and `svg` tags have their own cache
      const keyed = new WeakMapSet;
      // keyed operations always re-use the same cache and unroll
      // the template and its interpolations right away
      const fixed = cache => (template, ...values) => unroll(
        cache,
        {type, template, values}
      );
      return Object.assign(
        // non keyed operations are recognized as instance of Hole
        // during the "unroll", recursively resolved and updated
        (template, ...values) => new Hole(type, template, values),
        {
          // keyed operations need a reference object, usually the parent node
          // which is showing keyed results, and optionally a unique id per each
          // related node, handy with JSON results and mutable list of objects
          // that usually carry a unique identifier
          for(ref, id) {
            const memo = keyed.get(ref) || keyed.set(ref, new MapSet);
            return memo.get(id) || memo.set(id, fixed(createCache()));
          },
          // it is possible to create one-off content out of the box via node tag
          // this might return the single created node, or a fragment with all
          // nodes present at the root level and, of course, their child nodes
          node: (template, ...values) => unroll(createCache(), new Hole(type, template, values)).valueOf()
        }
      );
    };

    // each rendered node gets its own cache
    const cache = new WeakMapSet;

    // rendering means understanding what `html` or `svg` tags returned
    // and it relates a specific node to its own unique cache.
    // Each time the content to render changes, the node is cleaned up
    // and the new new content is appended, and if such content is a Hole
    // then it's "unrolled" to resolve all its inner nodes.
    const render$1 = (where, what) => {
      const hole = typeof what === 'function' ? what() : what;
      const info = cache.get(where) || cache.set(where, createCache());
      const wire = hole instanceof Hole ? unroll(info, hole) : hole;
      if (wire !== info.wire) {
        info.wire = wire;
        // valueOf() simply returns the node itself, but in case it was a "wire"
        // it will eventually re-append all nodes to its fragment so that such
        // fragment can be re-appended many times in a meaningful way
        // (wires are basically persistent fragments facades with special behavior)
        where.replaceChildren(wire.valueOf());
      }
      return where;
    };

    const html$1 = tag$1('html');
    const svg = tag$1('svg');

    const {defineProperties} = Object;

    const tag = original => {
      const wrap = new WeakMapSet;
      return defineProperties(
        asyncTag(original),
        {
          for: {
            value(ref, id) {
              const tag = original.for(ref, id);
              return wrap.get(tag) || wrap.set(tag, asyncTag(tag));
            }
          },
          node: {
            value: asyncTag(original.node)
          }
        }
      );
    };

    const html = tag(html$1);
    tag(svg);

    const render = (where, what) => {
      const hole = typeof what === 'function' ? what() : what;
      return Promise.resolve(hole).then(what => render$1(where, what));
    };

    let cachedStorage = undefined;

    // https://stackoverflow.com/a/59787784
    const isEmpty = obj => {
        for(const i in obj) {
            return false;
        }
        return true;
    };

    const setStorage = async val => (await chrome.storage.sync.set(val), cachedStorage = val);

    const patchStorage = async patch => await setStorage({ ...(await getStorage()), ...patch });

    const getStorage = async () => {
        if(cachedStorage) return cachedStorage;
        const storage = chrome.storage.sync.get();
        if(!storage || isEmpty(storage)) {
            return await setStorage({
                fixation: 0.5,
                saccade: 0,
                opacity: 1,
                fontWeight: 700
            });
        }
        return cachedStorage = storage;
    };

    function plainTag (t) {
      for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
        s += arguments[i] + t[i];
      return s;
    }

    const setStyles = (element, properties) => Object.entries(properties).forEach(kv => element.style.setProperty(...kv, "important"));

    // Doesn't actually do anything, this is just so the ide will highlight the css inside the tag
    // (WebStorm interprets anything inside css`` as css)
    const css = plainTag;

    const sliderTickMark = (min, max, val, sliderId, disp = (val) => val) => {
        const id = "bi-slider-tick--" + sliderId;

        return html`
        <style>
            ${css`#${id} {
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
            
            #${id} > :nth-child(1), :nth-child(3) {
                font-size: 0.8rem;
                padding: 0px 0.2rem;
            }`}
        </style>
        <div id=${id}>
            <span>${val === min ? "" : disp(min)}</span>
            <span>${disp(val)}</span>
            <span>${val === max ? "" : disp(max)}</span>
        </div>
    `;
    };

    async function updateBolding() {
        deboldify(document.body);
        boldify(document.body, await getStorage());
        document.getElementById("bi-style").innerText = getGlobalStyles(await getStorage());
    }

    // Add a UI to control the extension settings.
    // It will be isolated from the rest of the page it's injected into with shadow DOM.
    async function ui() {
        const container = document.createElement("div");
        setStyles(container, {
            all: "initial",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: "2147483647"
        });
        container.attachShadow({ mode: "open" });

        const waterCssUrl = chrome.runtime.getURL("assets/water.css");

        const initialState = {
            open: false
        };

        const rangeData = [
            {
                min: 0,
                max: 1,
                step: 0.1,
                name: "fixation",
                label: "Fixation",
                help: "Percent of the word that is bolded"
            },
            {
                min: 0,
                max: 5,
                step: 1,
                name: "saccade",
                label: "Saccade",
                // help: "Distance (in words) between bolded words"
                // help: "How many words to skip bolding"
                help: "Number of words to skip between each bolded word"
            },
            {
                min: 0,
                max: 1,
                step: 0.1,
                name: "opacity",
                label: "Opacity",
                help: "Opacity of the bolded text (useful if font weight doesn't work)"
            },
            {
                min: 100,
                max: 1000,
                step: 100,
                name: "fontWeight",
                label: "Font weight",
                help: "Thickness of the bolded text; may not work properly with non-variable-weight fonts"
            }
        ];

        await (async function update(state = initialState) {
            const storage = await getStorage();

            render(container.shadowRoot, html`
            <link rel="stylesheet" href=${waterCssUrl} />
            ${state.open ? html`
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
                    input[type=range] {
                        margin: 0;
                        padding: 3px 0;
                    }
                    input[type=range]:active {
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
                        ${rangeData.map(({ min, max, step, name, label, help }, i) => html.for(rangeData[i])`
                            <div class="bi-range">
                                <label for=${"bi-" + name}>${label}</label>
                                ${sliderTickMark(min, max, storage[name], name)}
                                <input type="range" min=${min} max=${max} step=${step} name=${"bi-" + name} value=${storage[name]} onchange=${async e => {
                                await patchStorage({ [name]: Number(e.target.value) });
                                await update(state);
                                await updateBolding();
                            }} />
                                <span>${help}</span>
                            </div>
                        `)}
                    </div>
                    <div class="bi-actions">
                        <button onclick=${() => {
                            // Remove controls from the page
                            container.remove();
                        }}>
                            Hide controls
                        </button>
                        <button onclick=${() => {
                            update({ ...state, open: false });
                        }}>Close</button>
                    </div>
                </div>
            ` : html`
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
                <button onclick=${() => {
                    update({ ...state, open: true });
                }}>
                    <img src=${chrome.runtime.getURL("icons/32.png")} alt="BiReader icon" />
                </button>
            `}
        `);
        })();

        document.body.appendChild(container);
    }

    function toggleBold(data) {
        console.log(data);
        if (!data.activate) {
            window.location.reload();
        } else {
            boldifyText();
        }
    }

    const getGlobalStyles = ({ fontWeight, opacity }) => `
.bi-bold b {
    font-weight: ${fontWeight} !important;
    opacity: ${opacity === 1 ? "inherit" : opacity} !important;
}
`;

    async function boldifyText() {
        const storage = await getStorage();
        boldify(document.body, storage);

        const s = document.createElement("style");
        s.id = "bi-style";
        s.innerText = getGlobalStyles(storage);
        document.head.appendChild(s);

        await ui();
    }

    polyfill(() => {
        chrome.runtime.onMessage.addListener(toggleBold);
    });

    exports.getGlobalStyles = getGlobalStyles;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
