import { ethers, Contract } from "ethers";
import Config from "../../configs/config";
import { abiMarketplace } from "../abis";
import { connectProvider } from "../connector/provider";

const ca = Config.MARKETPLACE_ADDR;
const abi = ["function getItems() view returns (Item)"];

const smartContact = () => {
	try {
		return new Contract(ca, abiMarketplace, connectProvider());
	} catch (error) {
		console.log(" === smartContact error ", error)
		return {};
	}
	
};

export const getAssetSupply = async () => {
	return ethers.utils.formatUnits(await smartContact().totalSupply(), 0);
};

export const getAllItemMarketplace = async () => {
	return await smartContact().getItems();
};
