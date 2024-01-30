import { Contract, ethers, providers } from "ethers";
import Config, { debug } from "../configs/config";
import { dAppChecked, smartContact, web3Provider } from "./providers/connector";
import { createHash } from "crypto";

/** Function without provider */
export const shortWallet = (_wallet) => {
  return `${_wallet.substring(0, 6)}...${_wallet.slice(-4)}`;
};

export const numberComma = (number) => {
  try {
    number = number.toString().replace(/,/g, "");
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return number;
  }
};

export const numberFormat = (number) => {
  try {
    if (number == "") {
      number = 0;
    }
    number = parseFloat(number);
    return numberComma(number.toFixed(2));
  } catch {
    return number;
  }
};

export const unlimitAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

/** Function is require provider */
export const checkTransaction = async (txnHash) => {
  /** Check dAdpp connected */
  if (await dAppChecked()) {
    // const provider = new providers.JsonRpcProvider(
    //   "https://data-seed-prebsc-2-s2.binance.org:8545/"
    // );
    const provider = web3Provider();
    const txn = await provider.getTransactionReceipt(txnHash);
    return txn;
  } /** End Check dApp */
};

export const generateVoucherCode = async ({tokenId, projectId, zoneId}) => {
  try{
    return `${projectId}-${zoneId}-${createHash('sha256').update(`${tokenId}${Date.now}`).digest('hex').slice(-7)}`;
  }catch{
    return "";
  }
};
