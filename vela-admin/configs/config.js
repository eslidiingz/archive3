export const app = "production";
export const debug = false;

import local from "/configs/config.local";
import staging from "/configs/config.staging";
import production from "/configs/config.production";

var Config = local;

if (app === "production") {
  Config = production;
} else if (app === "staging") {
  Config = staging;
}

Config.OFFICIAL_WALLETS = [
  "0x8e37A8294e866da31991EE1A097E5049Af3aFA85",
  "0xC838C64519fd98Fc205A32F2306cD3cf39BbB267",
  "0x1a07090067fe01A1b5Bf2EFED4D376517e5b71Ea",
  "0xc514b57Be642a782342439D74EA598B0A2994359",
  "0x9B5C850A7161f56d7E2235a74E69EeEB44431A1b",
];

console.log(`%c ========== App (${app}) ==========`, `color: skyblue`);

if (debug) {
  console.log(Config);
  console.log(`%c ========== End Config App ==========`, `color: skyblue`);
}

export default Config;
