import Web3 from "web3";
import { unlimit } from "../global";
import { getWalletAccount } from "./init";
import hasWeb3 from "./validator";
import tokenAbi from "/utils/abis/local/token.json";
import Config from "/utils/config";
import { app } from "../config";
const web3 = new Web3(Web3.givenProvider || "https://rpc.velaverse.io");
const tokenAddress = Config.CLASS_TOKEN_ADDR;
// const factoryAddress = Config.FACTORY_ADDR;
const landAddress = Config.LAND_ADDR;
let smToken = new web3.eth.Contract(tokenAbi, tokenAddress);
let whitelistAbi = [];
if (app == "staging") {
  whitelistAbi = require("./../abis/staging/whiteList.json");
} else if (app === "production") {
  whitelistAbi = require("./../abis/production/whiteList.json");
}
let smWhitelist = new web3.eth.Contract(whitelistAbi, Config.WHITE_LIST);

export const getPlaceItemRateFee = async () => {
  if (!hasWeb3()) return 0;
  try {
    return await smWhitelist.methods.rateFee().call();
  } catch (e) {
    console.log(
      "%c ===== ABI token incorrect getPlaceItemRateFee =====",
      "color:red;"
    );
    return;
  }
};

export const getBalanceToken = async (account = null) => {
  if (!hasWeb3()) return 0;
  let accountAddress = account || (await getWalletAccount());

  try {
    return await smToken.methods.balanceOf(accountAddress).call();
  } catch (e) {
    console.log(
      "%c ===== ABI token incorrect getBalanceToken =====",
      "color:red;"
    );
    return;
  }
};

export const getTokenSymbol = async () => {
  if (!hasWeb3()) return "UNKOWN";

  try {
    return await smToken.methods.symbol().call();
  } catch (e) {
    console.log(
      "%c ===== ABI token incorrect getBalanceToken =====",
      "color:red;"
    );
    return;
  }
};

export const checkTokenAllowance = async (
  contractAddress = landAddress,
  account = null
) => {
  // console.log("checkTokenAllowance contractAddress", contractAddress);
  if (!hasWeb3()) return 0;

  try {
    let accountWellet = account || (await getWalletAccount());

    return await smToken.methods
      .allowance(accountWellet, contractAddress)
      .call();
  } catch (e) {
    console.log(
      "%c ===== ABI token incorrect checkTokenAllowance =====",
      "color:red;"
    );
    return;
  }
};

export const approveToken = async (spender, amount) => {
  console.log("spender", spender);
  if (!hasWeb3()) return;
  let spenderAddress = spender || landAddress;
  let amountTotal = amount == 0 ? 0 : amount;
  amountTotal = amount || unlimit;

  return await smToken.methods.approve(spenderAddress, amountTotal).send({
    from: await getWalletAccount(),
  });
  // .on("sending", (sending) => {
  //   console.log("sending", sending);
  // })
  // .on("receipt", (receipt) => {
  //   console.log("receipt", receipt);
  // })
  // .on("error", (error) => {
  //   console.log("error", error);
  // });
};

export const revokeAllowance = async (spender, amount) => {
  if (!hasWeb3()) return;

  return await approveToken(null, "0");

  // let spenderAddress = spender || factoryAddress;
  // let amountTotal = amount || unlimit;

  // return await smToken.methods
  //   .decreaseAllowance(spenderAddress, amountTotal)
  //   .send({
  //     from: await getWalletAccount(),
  //   })
  //   .on("sending", (sending) => {
  //     console.log("sending", sending);
  //   })
  //   .on("receipt", (receipt) => {
  //     console.log("receipt", receipt);
  //   })
  //   .on("error", (error) => {
  //     console.log("error", error);
  //   });
};
