import fs from "fs/promises";

const webAccessibleResources = [
    "assets/water.css",
    "icons/32.png"
];

const manifest = (isFirefox) => ({
    "manifest_version": isFirefox ? 2 : 3,
    "name": "BiReader",
    "version": "1.1",

    "description": "Based off of the principles of Bionic Reader to improve speed and depth of reading web text!",

    "icons": {
        "48": "icons/48.png",
        "96": "icons/96.png"
    },

    [isFirefox ? "browser_action" : "action"]: {
        "default_icon": "icons/32.png",
        "default_title": "Turn BiReader On"
    },

    "background": {
        [isFirefox ? "scripts" : "service_worker"]: isFirefox ? ["background.js"] : "background.js"
    },

    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["reader.js"]
        }
    ],

    "web_accessible_resources": isFirefox ? webAccessibleResources : [
        {
            "matches": ["<all_urls>"],
            "resources": webAccessibleResources,
            "use_dynamic_url": true
        }
    ],

    "browser_specific_settings": {
        "gecko": {
            // Must remain constant for sync storage to transfer between versions
            id: "bireader@michaelzhao21.github.io"
        }
    },

    "permissions": [
        // Sync storage
        "storage"
    ]
});

void async function() {
    // Write the manifest based on the command line argument ("firefox" or "chromium")
    const isFirefox = process.argv[2] === "firefox";
    const manifestPath = "extension/manifest.json";
    const manifestContent = JSON.stringify(manifest(isFirefox), null, 4);
    await fs.writeFile(manifestPath, manifestContent);
    console.log(`Wrote manifest to ${manifestPath}`);
}();