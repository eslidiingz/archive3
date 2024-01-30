export const app = "production";
export const debug = true;

import local from "/utils/config.local.js";
import staging from "/utils/config.staging.js";
import production from "/utils/config.production.js";

var Config = local;

if (app === "production") {
  Config = production;
} else if (app === "staging") {
  Config = staging;
}

if (debug) {
  // console.log(`%c ============ Config [${app}]============`, "color:skyblue;");
  // console.log(Config);
}

export default Config;
