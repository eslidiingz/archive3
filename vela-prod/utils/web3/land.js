import Web3 from "web3";
import { getWalletAccount, web3 } from "./init";
import { getEventLogs, getLandsByOwner } from "./landApi";
import hasWeb3 from "./validator";
import Config, { app } from "/utils/config";
// import { pricePerLand } from "/utils/web3/landSetting";

var landABI;

if (app === "production") {
  landABI = require("/utils/abis/production/land.json");
} else if (app === "staging") {
  landABI = require("/utils/abis/staging/land.json");
} else {
  landABI = require("/utils/abis/local/land.json");
}

// const web3 = new Web3(Web3.givenProvider || "https://rpc.velaverse.io");

export const landAddress = Config.LAND_ADDR;

export const smLand = new web3.eth.Contract(landABI, landAddress);

export const smLandFn = (address = null) => {
  return address != null
    ? new web3.eth.Contract(landABI, address)
    : new web3.eth.Contract(landABI, landAddress);
};

export const getLandByTokenId = async (address = null, token) => {
  if (!hasWeb3()) return null;

  try {
    return await smLandFn(address).methods.tokenURI(token).call();
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect getLandByTokenId =====",
      "color:red;"
    );
    return null;
  }
};

export const getLandWithTokenId = async (tokenId, address = null) => {
  // if (!hasWeb3()) return null;

  try {
    const land = await smLandFn(address)
      .methods.getLandsByToken(tokenId)
      .call();

    return land;
  } catch (e) {
    console.log("error", e);

    return null;
  }
};

export const getLands = async (address = null) => {
  if (!hasWeb3()) return [];

  try {
    return await getEventLogs(address);
  } catch (e) {
    console.log("%c ===== incorrect getLands =====", "color:red;");
    return [];
  }
};

export const getBalanceOfLand = async (owner) => {
  if (!hasWeb3()) return null;

  try {
    return await smLandFn().methods.balanceOf(owner).call();
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect getBalanceOfLand =====",
      "color:red;"
    );
    return null;
  }
};

export const getTokenOfOwnerByIndex = async (owner, index) => {
  if (!hasWeb3()) return null;

  try {
    return await smLandFn().methods.tokenOfOwnerByIndex(owner, index).call();
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect getTokenOfOwnerByIndex =====",
      "color:red;"
    );
    return null;
  }
};

export const isApproval = async (owner, operator) => {
  if (!hasWeb3()) return null;
  try {
    return await cmLand.methods.isApprovedForAll(owner, operator).call();
  } catch (e) {
    console.log("%c ===== ABI Land incorrect isApproval =====", "color:red;");
    return null;
  }
};

export const setApprovalForAll = async (operator, owner) => {
  if (!hasWeb3()) return null;
  try {
    return await cmLand.methods
      .setApprovalForAll(operator, true)
      .send({ from: owner });
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect setApprovalForAll =====",
      "color:red;"
    );
    return null;
  }
};

export const getLandWithOwner = async (address = null, owner = null) => {
  if (!hasWeb3()) return null;

  try {
    let _owner = owner;

    if (owner == null) {
      _owner = await getWalletAccount();
    }

    return getLandsByOwner(address, _owner);
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect getLandWithOwner =====",
      "color:red;"
    );
    return null;
  }
};

export const getBaseLandURL = async () => {
  if (!hasWeb3()) return null;

  try {
    return await smLandFn().methods.baseUrl().call();
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect getBaseLandURL =====",
      "color:red;"
    );
    return null;
  }
};

export const buyLands = async (_x, _y, address = null) => {
  if (!hasWeb3()) return null;
  // const gasLimit = await smLand().methods.buyLands(zones, _x, _y).estimateGas({
  // 	from: from,
  // });
  return await smLandFn(address)
    .methods.buyLands(_x, _y)
    .send({
      from: await getWalletAccount(),
      // gasLimit: gasLimit,
    });
};

export const getTotalSupply = async (_contractAddress) => {
  if (!hasWeb3()) return null;

  try {
    return await smLandFn(_contractAddress).methods.totalSupply().call();
  } catch (e) {
    console.log(
      "%c ===== ABI Land incorrect getTotalSupply =====",
      "color:red;"
    );
    return null;
  }
};

// export const getPricePerLand = async (address = null) => {
//   try {
//     return await smLandFn(address).methods.pricePerLand().call();
//     return await pricePerLand();
//   } catch (e) {
//     console.log(
//       "%c ===== ABI Land incorrect getPricePerLand =====",
//       "color:red;"
//     );
//     return null;
//   }
// };

export const getLogs = async () => {
  const _d = await getEventLogs();
};

export const mapZoneByAddress = (_address) => {
  let map = {};

  switch (_address) {
    case "0x793552Ce098bB545bFE69cC9c4206Ac1FdA21059":
      map.name = "Phuket";
      map.zone = "Old Town";
      map.image = "/image/map/landmark-phuket-oldtown.jpg";
      break;

    case "0x4Ba865cE387867c1ef63a7C929Ce85D86062d379":
      map.name = "Korat";
      map.zone = "SUT";
      map.image = "https://cdn.velaverse.io/getdata/asset-land-sut.svg";
      break;

    default:
      map.name = "Korat";
      map.zone = "Yaamo";
      map.image = "https://cdn.epicgathering.io/getdata/asset-land.png";
      break;
  }

  return map;
};
