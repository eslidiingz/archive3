import Web3 from "web3";
import hasWeb3 from "./web3/validator";
import Config, { app } from "./config";
import { unlimit } from "./global";
import { toast } from "react-toastify";
import { ToastDisplay } from "../components/ToastDisplay";
import { smLandFn } from "./web3/land";

var landABI, tokenABI, buildingABI;

if (app === "production") {
  landABI = require("/utils/abis/production/land.json");
  tokenABI = require("/utils/abis/production/token.json");
  buildingABI = require("/utils/abis/production/GenBuilding.json");
} else if (app === "staging") {
  landABI = require("/utils/abis/staging/land.json");
  tokenABI = require("/utils/abis/staging/token.json");
  buildingABI = require("/utils/abis/staging/GenBuilding.json");
} else {
  landABI = require("/utils/abis/local/land.json");
  tokenABI = require("/utils/abis/local/token.json");
  buildingABI = require("/utils/abis/local/GenBuilding.json");
}
const web3 = new Web3(Web3.givenProvider || "https://rpc.velaverse.io");
export const cmLand = new web3.eth.Contract(landABI, Config.LAND_ADDR);
export const cmTokenClass = new web3.eth.Contract(
  tokenABI,
  Config.CLASS_TOKEN_ADDR
);
export const cmBuilding = new web3.eth.Contract(
  buildingABI,
  Config.GENNFT_ADDR
);
export const getTokenURI = async (item, tokenId) => {
  if (item == Config.GENNFT_ADDR) {
    return cmBuilding.methods.tokenURI(tokenId).call();
  } else if (item == Config.LAND_ADDR) {
    return cmLand.methods.tokenURI(tokenId).call();
  } else {
    return "";
  }
};
export const isTokenAllowance = async (token, owner, type = "market") => {
  if (!owner) return 0;
  let spender = getSpender(type);
  if (token == Config.CLASS_TOKEN_ADDR) {
    return cmTokenClass.methods.allowance(owner, spender).call();
  } else {
    return 0;
  }
};
export const SetApproveToken = async (
  token,
  owner,
  type = "market",
  success
) => {
  if (!owner) {
    success(false);
    toast(
      <ToastDisplay
        type={"error"}
        title={"Connect metamask"}
        description={"connect your metamask first"}
      />
    );
    return { status: true };
  }
  let spender = getSpender(type);
  if (token == Config.CLASS_TOKEN_ADDR) {
    return await cmTokenClass.methods
      .approve(spender, unlimit)
      .send({ from: owner })
      .on("sending", () => {
        success(false);
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("receipt", () => {
        success(true);
        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Transaction reciept"}
          />
        );
      })
      .on("error", (error) => {
        success(true);
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction failed"}
            description={error.message}
          />
        );
      });
  }
};
export const isContractApprove = async (contract, owner, type = "market") => {
  let status = false;
  let operator = getSpender(type);

  if (contract == Config.GENNFT_ADDR) {
    // Building
    status = await cmBuilding.methods.isApprovedForAll(owner, operator).call();
  } else {
    // Land
    status = await smLandFn(contract)
      .methods.isApprovedForAll(owner, operator)
      .call();
  }

  return status;
};
export const SetApproveContract = async (
  contract,
  owner,
  type = "market",
  success
) => {
  let operator = getSpender(type);

  if (contract == Config.GENNFT_ADDR) {
    return await cmBuilding.methods
      .setApprovalForAll(operator, true)
      .send({ from: owner })
      .on("sending", () => {
        success(false);
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("receipt", () => {
        success(true);
        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Transaction reciept"}
          />
        );
      })
      .on("error", (error) => {
        success(true);
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction failed"}
            description={error.message}
          />
        );
      });
  } else {
    return await smLandFn(contract)
      .methods.setApprovalForAll(operator, true)
      .send({ from: owner })
      .on("sending", () => {
        success(false);
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("receipt", () => {
        success(true);
        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Transaction reciept"}
          />
        );
      })
      .on("error", (error) => {
        success(true);
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction failed"}
            description={error.message}
          />
        );
      });
  }
};

export const getSpender = (type = "market") => {
  let spender = "";
  if (type == "market") {
    spender = Config.MARKETPLACE_ADDR;
  } else if (type == "bid") {
    spender = Config.BID_ADDR;
  } else if (type == "auction") {
    spender = Config.AUCTION_ADDR;
  } else if (type == "offer") {
    spender = Config.OFFER_ADDR;
  }
  return spender;
};
