import Web3 from "web3";
import Config from "../config.json";
import token from "../abis/token.json";
// import item from "../abis/item.json";
import avatar from "../abis/avatar.json";
import landFactory from '../abis/landFactory.json';
import marketplace from "../abis/marketplace.json";
import auction from "../abis/auction.json";
// import swap from "../abis/swap.json";
import { numberFormat } from "../number";
import { unlimit } from "../global";
import hasWeb3 from "./validator";

export const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

export const tokenContract = new web3.eth.Contract(
  token,
  process.env.CLASS_TOKEN_ADDR
);
//export const itemContract = new web3.eth.Contract(item, Config.ItemAddress);
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
export const landFactoryContract = new web3.eth.Contract(
  landFactory,
  Config.LandFactory
)
// export const swapContract = new web3.eth.Contract(
//   swap,
//   Config.MarketSwapAddress
// );
export const getWalletAccount = async () => {
  if(!hasWeb3()) return null;
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
  if(!hasWeb3()) return null;
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
  if(!hasWeb3()) return "UNKNOWN";
  return await tokenContract.methods.symbol().call();
};

// export const checkTokenAllowance = async (
//   account = null,
//   contractAddress = process.env.CLASS_TOKEN_ADDR
// ) => {
//   let accountWellet = account || (await getWalletAccount());

//   return await tokenContract.methods
//     .allowance(accountWellet, contractAddress)
//     .call();
// };

// export const approveToken = async (spender, amount) => {
//   let spenderAddress = spender || process.env.LAND_ADDR;
//   let amountTotal = amount || unlimit;

//   return await tokenContract.methods.approve(spenderAddress, amountTotal).send({
//     from: await getWalletAccount(),
//   });
// };

const numberFormatWallet = (n) => {
  if (n != 0) {
    return parseFloat(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return 0;
  }
};
