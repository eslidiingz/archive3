import dayjs from "dayjs";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  smartContact,
  web3Provider,
} from "/utils/providers/connector";
import Swal from "sweetalert2";
import { parseEther, id } from "ethers/lib/utils";
import { BigNumber, ethers, decodeEventLog } from "ethers";
import { smartContractLand } from "./Land";

export const smartContractMarket = (providerType = false) => {
  return smartContact(Config.MARKET_CA, Config.MARKET_ABI, providerType);
};

export const placeOrder = async (tokenId, price) => {
  try {
    if (debug) {
      console.log(
        `%c========== placeOrder(zoneId, amount) ==========`,
        "color: orange"
      );
    }

    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMarket] instant smart contract */

      const priceInWei = parseEther(price);
      // console.log(priceInWei, "priceInWei from placeOrder")

      const eventName = id(
        `PlaceOrder(address,address,uint256,uint256,address,uint256)`
      );
      const sc = smartContractMarket();
      const res = await sc.placeOrder(
        Config.LAND_CA,
        Config.BUSD_CA,
        tokenId,
        priceInWei
      );
      const resTx = await res.wait(6);

      const foundLog = resTx.logs.filter((log) => log.topics[0] === eventName);

      return foundLog.map((log) => {
        console.log(log, "foundLog from placeOrder");
        return { orderId: Number(log.topics[2]) };
      });
      // return resTx;
    }

    return false;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

export const getMarketItem = async () => {
  try {
    const marketItems = [];
    if (debug) {
      console.log(
        `%c========== placeOrder(zoneId, amount) ==========`,
        "color: orange"
      );
    }

    const sc = smartContractMarket(true);
    const scLand = smartContractLand(true);

    const items = await sc.getItems();

    if (Array.isArray(items)) {
      await Promise.all(
        items.map(async (item) => {
          const orderId = parseInt(BigNumber.from(item)._hex, 16);
          const order = await sc.getOrder(orderId);
          const orderDetail = order[1];

          if (orderDetail.available) {
            const tokenId = parseInt(
              BigNumber.from(orderDetail.tokenId)._hex,
              16
            );
            const plantingEndDate =
              parseInt(BigNumber.from(orderDetail.endProject)._hex, 16) * 1000;
            const itemDetail = await scLand.getSplitPart(tokenId);
            const projectId = parseInt(BigNumber.from(itemDetail[1])._hex, 16);
            const zoneId = parseInt(BigNumber.from(itemDetail[2])._hex, 16);
            const price = parseInt(BigNumber.from(orderDetail.price)._hex, 16);

            marketItems.push({
              orderId: orderId,
              projectId,
              assetToken: tokenId,
              price,
              zone: zoneId,
              plantingEndDate: {
                date: dayjs(plantingEndDate).format("YYYY-MM-DD"),
                timestampSecond: plantingEndDate,
              },
            });
          }
        })
      );
    }

    return marketItems;
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export const getOrderById = async (id) => {
  try {
    if (debug) {
      console.log(
        `%c========== placeOrder(zoneId, amount) ==========`,
        "color: orange"
      );
    }

    const sc = smartContractMarket(true);
    const scLand = smartContractLand(true);
    const order = await sc.getOrder(id);
    const orderDetail = order[1];
    const tokenId = parseInt(BigNumber.from(orderDetail.tokenId)._hex, 16);
    const plantingEndDate =
      parseInt(BigNumber.from(orderDetail.endProject)._hex, 16) * 1000;
    const itemDetail = await scLand.getSplitPart(tokenId);
    const projectId = parseInt(BigNumber.from(itemDetail[1])._hex, 16);
    const zoneId = parseInt(BigNumber.from(itemDetail[2])._hex, 16);

    return {
      orderId: id,
      available: orderDetail.available,
      // moreDetail: orderDetail,
      owner: orderDetail.owner,
      landContract: orderDetail.landContract,
      price: parseInt(BigNumber.from(orderDetail.price)._hex, 16),
      assetToken: tokenId,
      projectId,
      zone: zoneId,
      plantingEndDate: {
        date: dayjs(plantingEndDate).format("YYYY-MM-DD"),
        timestampSecond: plantingEndDate,
      },
    };
  } catch (e) {
    console.error(e.message);
    return {};
  }
};

export const buyOrder = async (orderId) => {
  try {
    if (debug) {
      console.log(`%c========== buyOrder(orderId) ==========`, "color: orange");
    }

    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMarket] instant smart contract */
      const sc = smartContractMarket();

      const res = await sc.buyOrder(orderId);
      const resTx = await res.wait(6);

      return resTx;
    }

    return false;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    if (debug) {
      console.log(
        `%c========== cancelOrder(orderId) ==========`,
        "color: blue"
      );
    }

    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMarket] instant smart contract */
      const sc = smartContractMarket();

      const res = await sc.cancelOrder(orderId);
      const resTx = await res.wait(6);

      return resTx;
    }

    return false;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};
