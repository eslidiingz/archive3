import Web3 from "web3";
import {
  abiAuction,
  abiMarketplace,
  abiMint,
  abiToken,
  abiBidStorage,
  abiOffer,
  abiWhitelist,
  abiLand,
} from "../abis/main";
import Config from "../config";

import { ipfsToCdn } from "../global";
import hasWeb3 from "./validator";

let _web3;

if (hasWeb3()) _web3 = new Web3(Web3.givenProvider);
else _web3 = new Web3(Config.JSON_RPC);

export const web3 = _web3;

// export const web3 = new Web3(Config.JSON_RPC);
// or
// export const web3 = new Web3(new Web3.providers.HttpProvider(Config.JSON_RPC));

// export const web3 = new Web3(Web3.givenProvider);

export const tokenContract = new web3.eth.Contract(
  abiToken,
  Config.CLASS_TOKEN_ADDR
);

export const marketplaceContract = new web3.eth.Contract(
  abiMarketplace,
  Config.MARKETPLACE_ADDR
);

export const offerContract = new web3.eth.Contract(abiOffer, Config.OFFER_ADDR);

export const landContract = new web3.eth.Contract(abiLand, Config.LAND_ADDR);

export const bidContract = new web3.eth.Contract(
  abiBidStorage,
  Config.BID_ADDR
);

export const mintContract = new web3.eth.Contract(abiMint, Config.GENNFT_ADDR);
export const auctionContract = new web3.eth.Contract(
  abiAuction,
  Config.AUCTION_ADDR
);

export const whitelistContract = new web3.eth.Contract(
  abiWhitelist,
  Config.WHITE_LIST
);

export const getWalletAccount = async () => {
  if (!hasWeb3()) return null;

  const accounts = await web3.eth.getAccounts();

  return accounts[0];
};

export const getMetadata = async (url) => {
  try {
    const _res = await fetch(`${url}`);
    const json = await _res.json();
    json.image = ipfsToCdn(json.image);

    return json;
  } catch (error) {
    console.error(error);
  }
};

export const getBlockExplorer = () => {
  return Config.BLOCK_EXPLORER;
};

export const getBalance = async () => {
  if (!hasWeb3()) return null;
  const account = await getWalletAccount();
  let balance = null;

  if (typeof account !== "undefined") {
    try {
      const balanceWei = await tokenContract.methods.balanceOf(account).call();

      balance = Web3.utils.fromWei(balanceWei);
      const split = balance.split(".");

      balance = `${numberFormatWallet(split[0])}`;

      if (split.length > 1) {
        balance = `${balance}.${split[1].substring(0, 4)}`;
      }
    } catch (e) {
      console.log("%c ===== ABI Init incorrect balanceOf =====", "color: red;");
    }
  }

  return balance;
};

export const getTokenSymbol = async () => {
  if (!hasWeb3()) return "UNKNOWN";

  try {
    return await tokenContract.methods.symbol().call();
  } catch (e) {
    console.log(
      "%c ===== ABI Init incorrect getTokenSymbol =====",
      "color: red;"
    );
    return null;
  }
};

export const getStrTokenSymbol = () => {
  return "WCLASS";
};

const numberFormatWallet = (n) => {
  if (n != 0) {
    return parseFloat(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return 0;
  }
};

export const abbreviateNumber = (number) => {
  const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  var tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier == 0) return number;

  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  var scaled = number / scale;

  return scaled.toFixed(1) + suffix;
};
