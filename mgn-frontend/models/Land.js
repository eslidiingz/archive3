import dayjs from "dayjs";
import Config, { debug } from "/configs/config";
import {
  dAppChecked,
  smartContact,
  web3Provider,
} from "/utils/providers/connector";
import Swal from "sweetalert2";
import { parseEther, parseUnits, formatEther } from "ethers/lib/utils";
import { utils, BigNumber, constants } from "ethers";

const LIMIT_ZONE = 5;
const PROJECT_ID = 0;

export const smartContractLand = (providerType = false) => {
  return smartContact(Config.LAND_CA, Config.LAND_ABI, providerType);
};

export const placeBuyLand = async (projectId, zoneId, amount) => {
  try {
    if (debug) {
      console.log(
        `%c========== placeBuyLand(zoneId, amount) ==========`,
        "color: orange"
      );
    }

    /** Check dApp before action anything */
    if (await dAppChecked()) {
      /** [smMarket] instant smart contract */
      const sc = smartContractLand();
      // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
      const eventName = utils.id(`Transfer(address,address,uint256)`);
      const res = await sc.buyLands(projectId, zoneId, amount);
      const resTx = await res.wait(6);

      const foundLogs = resTx.logs.filter(
        (log) =>
          log.topics[0] === eventName &&
          log.topics[1] ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
      );

      return foundLogs.map((log) => {
        return { tokenId: Number(log.topics[3]), projectId, zoneId };
      });
    }

    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getZoneDetail = async (_zone) => {
  const sm = smartContractLand(false);

  if (debug) {
    console.log(
      `%c========== getZoneDetail(_zone) ==========`,
      "color: orange"
    );
    console.log(`%c>>>>>>>>>> _zone >>>>>>>>>>`, "color: pink", _zone);
  }

  let result = await sm.zones(_zone);

  if (debug) {
    console.log(
      `%c<<<<<<<<<< getZoneDetail(_zone) <<<<<<<<<<`,
      "color: violet",
      result
    );
  }
};

export const getIsTokenLocked = async (_tokenId) => {
  const sm = smartContractLand();
  let result = await sm.isTokenLocked(_tokenId);

  if (debug) {
    console.log(
      `%c<<<<<<<<<< isTokenLocked(result) <<<<<<<<<<`,
      "color: violet",
      result
    );
  }
  return result;
};

export const getSellingLand = async (activeProjects = []) => {
  try {
    const sm = smartContractLand(true);

    const onSellingLand = await Promise.all(
      activeProjects.map(async (project) => {
        const zoneInfo = await sm.getZoneInfo(
          project.project_id,
          project.zone_id
        );
        const startSaleAt =
          parseInt(BigNumber.from(zoneInfo.startSalesTime)._hex, 16) * 1000;
        const endSaleAt =
          parseInt(BigNumber.from(zoneInfo.endSalesTime)._hex, 16) * 1000;
        const zoneMaxId = parseInt(BigNumber.from(zoneInfo.zoneMaxId)._hex, 16);
        const boughtAmount = parseInt(
          BigNumber.from(zoneInfo.tokenCounter)._hex,
          16
        );
        const claimAt =
          parseInt(BigNumber.from(zoneInfo.endHoldingTime)._hex, 16) * 1000;
        return {
          projectName: project.project_name,
          projectId: project.project_id,
          land: project.zone_id,
          startSaleAt,
          endSaleAt,
          amountLeft: zoneMaxId - boughtAmount,
          claimAt: claimAt,
        };
      })
    );

    return onSellingLand;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getLandStartSale = async (land) => {
  try {
    const sm = smartContractLand(true);

    const startSale = await sm.getProjectStartSalesDate(land);

    return parseInt(BigNumber.from(startSale)._hex, 16) * 1000;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const getLandBoughtAmount = async (land) => {
  try {
    const sm = smartContractLand(true);

    const boughtAmount = await sm.getTokenIdCounter(land);

    return boughtAmount;
  } catch (e) {
    return 0;
  }
};

export const getZoneInfo = async (projectId, zoneId) => {
  try {
    const sm = smartContractLand();

    const zoneInfo = await sm.getZoneInfo(projectId, zoneId);
    const price = formatEther(zoneInfo.landPrice);
    const plantingEndDate =
      parseInt(BigNumber.from(zoneInfo.endHoldingTime)._hex, 16) * 1000;
    const zoneRewardRate =
      parseInt(BigNumber.from(zoneInfo.zoneRewardRate)._hex, 16) / 1000;

    return {
      projectId,
      zone: zoneId,
      price,
      zoneRewardRate,
      plantingEndDate: {
        date: dayjs(plantingEndDate).format("YYYY-MM-DD"),
        timestampSecond: plantingEndDate,
      },
    };
  } catch (e) {
    console.log(e.message);
    return {};
  }
};

export const getMyLand = async (wallet) => {
  try {
    const sm = smartContractLand();
    const balanceItems = await sm.balanceOf(wallet);
    const balance = parseInt(BigNumber.from(balanceItems)._hex, 16);

    const landDetailList = [];

    for (let i = 0; i < balance; i++) {
      const token = await sm.tokenOfOwnerByIndex(wallet, i);
      const tokenId = parseInt(BigNumber.from(token)._hex, 16);
      const isLocked = await sm.isTokenLocked(tokenId);

      // if (!isLocked) {
      // [0] = token, [1] = projectId, [2] = zoneId
      const itemDetail = await sm.getSplitPart(tokenId);
      const projectId = parseInt(BigNumber.from(itemDetail[1])._hex, 16);
      const zoneId = parseInt(BigNumber.from(itemDetail[2])._hex, 16);
      const zoneInfo = await sm.getZoneInfo(projectId, zoneId);
      const price = formatEther(zoneInfo.landPrice);
      const plantingEndDate =
        parseInt(BigNumber.from(zoneInfo.endHoldingTime)._hex, 16) * 1000;
      const zoneRewardRate =
        parseInt(BigNumber.from(zoneInfo.zoneRewardRate)._hex, 16) / 1000;

      landDetailList.push({
        assetToken: tokenId,
        projectId,
        zone: zoneId,
        price,
        zoneRewardRate,
        plantingEndDate: {
          date: dayjs(plantingEndDate).format("YYYY-MM-DD"),
          timestampSecond: plantingEndDate,
        },
        isLocked,
      });
      // }
    }

    return landDetailList;
  } catch (e) {
    console.log(e.message);
    return [];
  }
};

export const getLandDetailByTokenId = async (tokenId) => {
  try {
    const sm = smartContractLand();
    const isLocked = await sm.isTokenLocked(tokenId);

    // [0] = token, [1] = projectId, [2] = zoneId
    const itemDetail = await sm.getSplitPart(tokenId);
    const projectId = parseInt(BigNumber.from(itemDetail[1])._hex, 16);
    const zoneId = parseInt(BigNumber.from(itemDetail[2])._hex, 16);
    const zoneInfo = await sm.getZoneInfo(projectId, zoneId);
    const price = formatEther(zoneInfo.landPrice);
    const plantingEndDate =
      parseInt(BigNumber.from(zoneInfo.endHoldingTime)._hex, 16) * 1000;
    const zoneRewardRate =
      parseInt(BigNumber.from(zoneInfo.zoneRewardRate)._hex, 16) / 1000;
    const ownerAddress = await sm.ownerOf(tokenId);

    return {
      ownerAddress,
      assetToken: tokenId,
      projectId,
      zone: zoneId,
      price,
      zoneRewardRate,
      plantingEndDate: {
        date: dayjs(plantingEndDate).format("YYYY-MM-DD"),
        timestampSecond: plantingEndDate,
      },
      isLocked,
      contractAddress: Config.LAND_CA,
    };
  } catch (e) {
    console.error(e.message);
    return {};
  }
};

export const setApproveForMarket = async () => {
  try {
    if (await dAppChecked()) {
      const sm = smartContractLand();
      const res = await sm.setApprovalForAll(Config.MARKET_CA, true);
      const resTxn = await res.wait(6);

      return resTxn ? true : false;
    }
  } catch {
    return false;
  }
};

export const setApproveForClaim = async () => {
  try {
    if (await dAppChecked()) {
      const sm = smartContractLand();
      const res = await sm.setApprovalForAll(Config.CLAIM_CA, true);
      const resTxn = await res.wait(6);

      return resTxn ? true : false;
    }
  } catch {
    return false;
  }
};

export const getApproveForMarket = async (wallet) => {
  try {
    if (await dAppChecked()) {
      const sm = smartContractLand();
      const res = await sm.isApprovedForAll(wallet, Config.MARKET_CA);
      return res;
    }
  } catch {
    return false;
  }
};

export const getApproveForCalim = async (wallet) => {
  try {
    if (await dAppChecked()) {
      const sm = smartContractLand();
      const res = await sm.isApprovedForAll(wallet, Config.CLAIM_CA);
      return res;
    }
  } catch {
    return false;
  }
};

export const setOpenZone = async (
  projId,
  startSaleTime,
  endSaleTime,
  maxId,
  endProjectTime,
  rewardRate,
  landPrice,
  clinicReward,
  receiveAddress
) => {
  try {
    if (await dAppChecked()) {
      const sc = smartContractLand();

      const landPriceInWei = parseEther(landPrice);

      const res = await sc.openZone(
        projId,
        startSaleTime,
        endSaleTime,
        maxId,
        endProjectTime,
        rewardRate,
        landPriceInWei,
        clinicReward,
        receiveAddress
      );
      const resTx = res.wait();

      return resTx;
    }
  } catch {
    return false;
  }
};
