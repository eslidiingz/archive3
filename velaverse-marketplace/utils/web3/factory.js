import Web3 from "web3";
import { unlimit } from "../global";
import { getWalletAccount } from "./init";
import hasWeb3 from "./validator";
import factoryAbi from "/utils/abis/factory.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const FactoryAddress = process.env.FACTORY_ADDR;
const landAddress = process.env.LAND_ADDR;
const smFactory = new web3.eth.Contract(factoryAbi, FactoryAddress);

export const getPricePerLand = async () => {
  if(!hasWeb3()) return 0;
  return await smFactory.methods.pricePerLand().call();
};

// export const getBalanceToken = async (account = null) => {
//   let accountAddress = account || (await getWalletAccount());

//   return await smToken.methods.balanceOf(accountAddress).call();
// };

// export const getTokenSymbol = async () => {
//   return await smToken.methods.symbol().call();
// };

// export const checkTokenAllowance = async (
//   contractAddress = landAddress,
//   account = null
// ) => {
//   let accountWellet = account || (await getWalletAccount());

//   return await smToken.methods.allowance(accountWellet, contractAddress).call();
// };

// export const approveToken = async (spender, amount) => {
//   let spenderAddress = spender || landAddress;
//   let amountTotal = amount || unlimit;

//   return await smToken.methods
//     .approve(spenderAddress, amountTotal)
//     .send({
//       from: await getWalletAccount(),
//     })
//     .on("sending", (sending) => {
//       console.log("sending", sending);
//     })
//     .on("receipt", (receipt) => {
//       console.log("receipt", receipt);
//     })
//     .on("error", (error) => {
//       console.log("error", error);
//     });
// };

// export const revokeAllowance = async (spender, amount) => {
//   let spenderAddress = spender || landAddress;
//   let amountTotal = amount || unlimit;

//   return await smToken.methods
//     .decreaseAllowance(spenderAddress, amountTotal)
//     .send({
//       from: await getWalletAccount(),
//     })
//     .on("sending", (sending) => {
//       console.log("sending", sending);
//     })
//     .on("receipt", (receipt) => {
//       console.log("receipt", receipt);
//     })
//     .on("error", (error) => {
//       console.log("error", error);
//     });
// };
