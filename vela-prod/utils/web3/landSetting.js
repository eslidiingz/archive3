import Web3 from "web3";
import { getWalletAccount } from "./init";
import hasWeb3 from "./validator";
import Config, { app } from "/utils/config";
import { web3 } from "./init";

var landSettingABI;

if (app === "production") {
  landSettingABI = require("/utils/abis/production/landSetting.json");
} else if (app === "staging") {
  landSettingABI = require("/utils/abis/staging/landSetting.json");
} else {
  landSettingABI = require("/utils/abis/local/landSetting.json");
}

export const smLandSetting = new web3.eth.Contract(
  landSettingABI,
  Config.YAAMO_SETTING_ADDR
);

export const smLandSettingFn = (address = null) => {
  return address != null
    ? new web3.eth.Contract(landSettingABI, Config.YAAMO_SETTING_ADDR)
    : new web3.eth.Contract(landSettingABI, address);
};

export const getGlobalWallet = async () => {
  if (!hasWeb3()) return null;

  try {
    return await smLandSetting.methods.getGlobalWallet().call();
  } catch (error) {
    console.log(
      "%c ===== ABI LandSetting incorrect globalWallet =====",
      "color:red;"
    );
    return null;
  }
};

export const pricePerLand = async () => {
  if (!hasWeb3()) return null;

  try {
    return await smLandSetting.methods.getPricePerLand().call();
  } catch (error) {
    console.log(
      "%c ===== ABI LandSetting incorrect pricePerLand =====",
      "color:red;"
    );
    return null;
  }
};

export const restrictedArea = async (_x, _y, address = null) => {
  if (!hasWeb3()) return null;

  try {
    return await smLandSettingFn(address).methods.restrictedArea(_x, _y).call();
  } catch (error) {
    console.log(
      "%c ===== ABI LandSetting incorrect restrictedArea =====",
      "color:red;"
    );
    return null;
  }
};
