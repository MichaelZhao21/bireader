const esbuild = require('esbuild');
const fs = require('fs-extra');

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

    browser_specific_settings: isFirefox && {
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

const define = { 'process.env.IS_FIREFOX': process.env.IS_FIREFOX ? 'true' : 'false' };
esbuild.buildSync({
    entryPoints: ['src/background.js'],
    bundle: true,
    outfile: 'extension/background.js',
    define,
});
esbuild.buildSync({
    entryPoints: ['src/reader.js'],
    bundle: true,
    outfile: 'extension/reader.js',
    define,
});
esbuild.buildSync({
    entryPoints: ['src/popup.js'],
    bundle: true,
    outfile: 'extension/popup.js',
    define,
})

fs.copySync('icons', 'extension/icons');
fs.copyFileSync('src/popup.html', 'extension/popup.html');
fs.copyFileSync('src/popup.css', 'extension/popup.css');
