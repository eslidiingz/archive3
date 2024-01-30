import Web3 from "web3";
import Config from "../config.json";
import token from "../abis/token.json";
import item from "../abis/item.json";
import avatar from "../abis/avatar.json";
import marketplace from "../abis/marketplace.json";
import auction from "../abis/auction.json";
import swap from "../abis/swap.json";
import { numberFormat } from "../number";
import land from '../abis/land.json';
import landStorage from '../abis/landStorage.json';
export const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

export const tokenContract = new web3.eth.Contract(token, Config.TokenAddress);
export const itemContract = new web3.eth.Contract(item, Config.ItemAddress);
export const landContract = new web3.eth.Contract(
  land,
  Config.LandAddress
); // 721
export const landStorageContract = new web3.eth.Contract(
  landStorage,
  Config.LandStorage
);
export const avatarContract = new web3.eth.Contract(
  avatar,
  Config.AvatarAddress
);
export const marketplaceContract = new web3.eth.Contract(
  marketplace,
  Config.MarketPlaceAddress
);
export const auctionContract = new web3.eth.Contract(
  auction,
  Config.MarketAuctionAddress
);
export const swapContract = new web3.eth.Contract(
  swap,
  Config.MarketSwapAddress
);
export const getWalletAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const getMetadata = async (url) => {
  const option = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    const _res = await fetch(`${url}`);
    const json = await _res.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};
export const getBlockExplorer = () => {
  return Config.blockExplorer;
};

export const getBalance = async () => {
  const account = await getWalletAccount();
  let balance = null;

  if (typeof account !== "undefined") {
    const balanceWei = await tokenContract.methods.balanceOf(account).call();

    balance = Web3.utils.fromWei(balanceWei);
    const split = balance.split(".");

    balance = `${numberFormatWallet(split[0])}`;

    if (split.length > 1) {
      balance = `${balance}.${split[1].substring(0, 4)}`;
    }
  }

  return balance;
};

export const getTokenSymbol = async () => {
  return await tokenContract.methods.symbol().call();
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
