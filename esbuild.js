const esbuild = require('esbuild');
const fs = require('fs-extra');
const fetch = require('node-fetch');

const WEB_ACCESSIBLE_RESOURCES = ['assets/water.css', 'icons/32.png'];

// Manifest generation
const generateManifest = (isFirefox) => ({
    manifest_version: isFirefox ? 2 : 3,
    name: 'BiReader',
    version: '1.1',

    description:
        'Based off of the principles of Bionic Reader to improve speed and depth of reading web text!',

    icons: {
        48: 'icons/48.png',
        96: 'icons/96.png',
    },

    [isFirefox ? 'browser_action' : 'action']: {
        default_icon: 'icons/32.png',
        default_title: 'Turn BiReader On',
    },

    background: {
        [isFirefox ? 'scripts' : 'service_worker']: isFirefox ? ['background.js'] : 'background.js',
    },

    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ['reader.js'],
        },
    ],

    web_accessible_resources: isFirefox
        ? WEB_ACCESSIBLE_RESOURCES
        : [
              {
                  matches: ['<all_urls>'],
                  resources: WEB_ACCESSIBLE_RESOURCES,
                  use_dynamic_url: true,
              },
          ],

    browser_specific_settings: {
        gecko: {
            id: 'bireader@michaelzhao.xyz',
        },
    },

    permissions: ['storage'],
});

// Run all build scripts
fs.removeSync('extension');
fs.mkdirSync('extension');

fs.writeFileSync(
    'extension/manifest.json',
    JSON.stringify(generateManifest(process.env.IS_FIREFOX), null, 4)
);

esbuild.buildSync({
    entryPoints: ['src/background.js'],
    bundle: true,
    outfile: 'extension/background.js',
});

esbuild.buildSync({
    entryPoints: ['src/reader.js'],
    bundle: true,
    outfile: 'extension/reader.js',
});

fs.copySync('icons', 'extension/icons');

fetch('https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css')
    .then((data) => data.text())
    .then((text) => fs.writeFileSync('extension/water.min.css', text));
