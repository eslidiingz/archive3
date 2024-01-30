import Web3 from "web3";
import { unlimit } from "../global";
import { getWalletAccount } from "./init";
import hasWeb3 from "./validator";
import tokenAbi from "/utils/abis/token.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const tokenAddress = process.env.CLASS_TOKEN_ADDR;
const landAddress = process.env.LAND_ADDR;
const factoryAddress = process.env.FACTORY_ADDR;
const smToken = new web3.eth.Contract(tokenAbi, tokenAddress);

export const getBalanceToken = async (account = null) => {
  if(!hasWeb3()) return 0;
  let accountAddress = account || (await getWalletAccount());

  return await smToken.methods.balanceOf(accountAddress).call();
};

export const getTokenSymbol = async () => {
  if(!hasWeb3()) return "UNKOWN";
  return await smToken.methods.symbol().call();
};

export const checkTokenAllowance = async (
  contractAddress = factoryAddress,
  account = null
) => {
  if(!hasWeb3()) return 0;
  let accountWellet = account || (await getWalletAccount());
  return await smToken.methods.allowance(accountWellet, contractAddress).call();
};

export const approveToken = async (spender, amount) => {
  if(!hasWeb3()) return;
  let spenderAddress = spender || factoryAddress;
  let amountTotal = amount || unlimit;

  return await smToken.methods
    .approve(spenderAddress, amountTotal)
    .send({
      from: await getWalletAccount(),
    })
    .on("sending", (sending) => {
      console.log("sending", sending);
    })
    .on("receipt", (receipt) => {
      console.log("receipt", receipt);
    })
    .on("error", (error) => {
      console.log("error", error);
    });
};

export const revokeAllowance = async (spender, amount) => {
  if(!hasWeb3()) return;
  let spenderAddress = spender || factoryAddress;
  let amountTotal = amount || unlimit;

  return await smToken.methods
    .decreaseAllowance(spenderAddress, amountTotal)
    .send({
      from: await getWalletAccount(),
    })
    .on("sending", (sending) => {
      console.log("sending", sending);
    })
    .on("receipt", (receipt) => {
      console.log("receipt", receipt);
    })
    .on("error", (error) => {
      console.log("error", error);
    });
};
