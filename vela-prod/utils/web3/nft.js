import Web3 from "web3";
import { abiMint } from "../abis/main";
import Config from "../config";

const web3 = new Web3(Web3.givenProvider || "https://rpc.velaverse.io");
export const assetAddress = Config.GENNFT_ADDR;

export const cmAssets = new web3.eth.Contract(abiMint, assetAddress);

export const getNFTUrl = async (id) => {
  try {
    return await cmAssets.methods.tokenURI(id).call();
  } catch (e) {
    console.log("%c ===== ABI GENNFT incorrect getNFTUrl =====", "color:red;");
    return;
  }
};
