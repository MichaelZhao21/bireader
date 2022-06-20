import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import injectProcessEnv from "rollup-plugin-inject-process-env";

const plugins = [
    nodeResolve(),
    commonjs(),
    injectProcessEnv({
        IS_FIREFOX: process.env.IS_FIREFOX
    })
];

/** @type {import('rollup').RollupOptions} */
const rollupConfig = [
    {
        input: "src/contentScript/reader.js",
        output: {
            file: "extension/reader.js",
            format: "iife"
        },
        plugins
    },
    {
        input: "src/background/background.js",
        output: {
            file: "extension/background.js",
            format: "iife"
        },
        plugins
    }
];

export default rollupConfig;