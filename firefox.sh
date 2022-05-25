#!/bin/bash

rm -rf firefox
mkdir firefox
cp manifest-ff.json firefox/manifest.json
cp reader.js firefox
cat background.js | sed -e 's/action/browserAction/g' > firefox/background.js
cp -r icons firefox
curl https://unpkg.com/webextension-polyfill@0.9.0/dist/browser-polyfill.min.js > firefox/browser-polyfill.js
