export const app = "production";
export const debug = true;

import local from "./config.local";
import staging from "./config.staging";
import production from "./config.production";

var Config = local;

if (app === "production") {
  Config = production;
} else if (app === "staging") {
  Config = staging;
}

if (debug) {
  console.log(`%c========== App (${app}) ==========`, `color: skyblue`);
  console.log(Config);
  console.log(`%c========== End Config App ==========`, `color: skyblue`);
}

export default Config;
