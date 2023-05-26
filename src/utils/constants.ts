import tauriConfJson from "../../src-tauri/tauri.conf.json";
import packageJson from "../../package.json";

export const VERSION = packageJson.version;
export const APP_NAME = tauriConfJson.package.productName;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
