import { BigNumber, ethers } from "ethers";
import { unlimitAmount } from "/utils/misc";
import Config, { debug } from "/configs/config";
import { dAppChecked, smartContact } from "/utils/providers/connector";
import { web3Provider } from "../utils/providers/connector";

export const smartContractBusd = (providerType = false) => {
  return smartContact(Config.BUSD_CA, Config.BUSD_ABI, providerType);
};

export const getUsdcBalance = async (wallet) => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    const scBusd = smartContractBusd();
    console.log(wallet, " wallet from ethers");
    res = await scBusd.balanceOf(wallet);
  } /** End Check dApp */

  if (debug)
    console.log(`%c>>>>> balanceOfWallet [${res}] >>>>>`, "color: red");

  return res;
};

export const approveUsdcMarket = async () => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    const scBusd = smartContractBusd();
    res = await scBusd.approve(Config.MARKET_CA, unlimitAmount);
    res = await res.wait(6);
  } /** End Check dApp */

  return res;
};

export const approveUsdc = async () => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    const scBusd = smartContractBusd();
    res = await scBusd.approve(Config.LAND_CA, unlimitAmount);
    res = await res.wait(6);
  } /** End Check dApp */

  return res;
};

export const getIsApproveLand = async (wallet) => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    const scBusd = smartContractBusd();
    res = await scBusd.allowance(wallet, Config.LAND_CA);
    console.log(res, "Log from get is Approve");
  } /** End Check dApp */

  return res;
};

export const getIsApproveClaim = async (wallet) => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    const scBusd = smartContractBusd();
    res = await scBusd.allowance(wallet, Config.CLAIM_CA);
    console.log(res, "Log from get is Approve");
  } /** End Check dApp */

  return res;
};

export const getIsApproveMarket = async (wallet) => {
  let res;
  /** Check dApp before action anything */
  if (await dAppChecked()) {
    /** [smLand] instant smart contract */
    const scBusd = smartContractBusd();
    res = await scBusd.allowance(wallet, Config.MARKET_CA);
    console.log(res, "Log from get is Approve");
  } /** End Check dApp */

  return res;
};
