import { app } from "../../configs/config";

var _marketplace;
// var _whitelist, _token, _mint, _land, _marketplace, _offer, _auction, _bid;

if (app === "production") {
  // _whitelist = require("/utils/abis/staging/whiteList.json");
  // _token = require("/utils/abis/staging/token.json");
  // _mint = require("/utils/abis/staging/GenBuilding.json");
  // _land = require("/utils/abis/staging/land.json");
  _marketplace = require("../abis/production/marketplace.json");
  // _offer = require("/utils/abis/staging/OfferStorage.json");
  // _auction = require("/utils/abis/staging/AuctionStorage.json");
  // _bid = require("/utils/abis/staging/BidStorage.json");
} else if (app === "staging") {
  // _whitelist = require("/utils/abis/staging/whiteList.json");
  // _token = require("/utils/abis/staging/token.json");
  // _mint = require("/utils/abis/staging/GenBuilding.json");
  // _land = require("/utils/abis/staging/land.json");
  _marketplace = require("../abis/production/marketplace.json");
  // _offer = require("/utils/abis/staging/OfferStorage.json");
  // _auction = require("/utils/abis/staging/AuctionStorage.json");
  // _bid = require("/utils/abis/staging/BidStorage.json");
} else {
  // _whitelist = require("/utils/abis/staging/whiteList.json");
  // _token = require("/utils/abis/staging/token.json");
  // _mint = require("/utils/abis/staging/GenBuilding.json");
  // _land = require("/utils/abis/staging/land.json");
  _marketplace = require("../abis/production/marketplace.json");
  // _offer = require("/utils/abis/staging/OfferStorage.json");
  // _auction = require("/utils/abis/staging/AuctionStorage.json");
  // _bid = require("/utils/abis/staging/BidStorage.json");
}

// export const abiWhitelist = _whitelist;
// export const abiToken = _token;
// export const abiMint = _mint;
// export const abiLand = _land;
export const abiMarketplace = _marketplace;
// export const abiOffer = _offer;
// export const abiAuction = _auction;
// export const abiBidStorage = _bid;
