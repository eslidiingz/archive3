import Web3 from "web3";
import { getWalletAccount } from "./init";
import hasWeb3 from "./validator";
import factoryAbi from "/utils/abis/factory.json";
import Config from "/utils/config";

const web3 = new Web3(Web3.givenProvider || "https://rpc.velaverse.io");
const factoryAddress = Config.FACTORY_ADDR;

export const smFactoryOrigin = new web3.eth.Contract(
  factoryAbi,
  factoryAddress
);
export var smFactory = new web3.eth.Contract(factoryAbi, factoryAddress);

export const getPricePerLand = async (_factory = null) => {
  if (!hasWeb3()) return 0;

  return await factoryDetected(_factory).methods.pricePerLand().call();
};

export const getMyLands = async (_factory = null) => {
  if (!hasWeb3()) return 0;

  return await factoryDetected(_factory)
    .methods.getLandWithOwner(await getWalletAccount())
    .call();
};
export const getLandDataByTokenId = async (tokenId, _factory = null) => {
  if (!hasWeb3()) return null;
  return await factoryDetected(_factory)
    .methods.getLandWithTokenId(tokenId)
    .call();
};

export const buyLands = async (_zone, _x, _y, _factory = null) => {
  if (!hasWeb3()) return 0;
  /** Gas estimate per land = 13134860 */
  // console.log(_zone.length);

  let receiveAddress = await getWalletAccount();

  let gasLimit = _zone.length * 1313486;

  // 12134860;
  // 19376458

  return await factoryDetected(_factory).methods.buyLands(_zone, _x, _y).send({
    from: receiveAddress,
    // gasLimit: gasLimit,
  });
};

export const getLands = async (_factory = null) => {
  return await factoryDetected(_factory).methods.getLands().call();
};

const factoryDetected = (_factoryAddress = null) => {
  let smartContractFactory = smFactoryOrigin;

  if (_factoryAddress !== null) {
    smartContractFactory = new web3.eth.Contract(factoryAbi, _factoryAddress);
  }

  return smartContractFactory;
};
