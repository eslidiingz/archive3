/** @format */

import { ethers, Contract } from "ethers";
import { connectProvider } from "../connector/provider";
import Config from "../../configs/config";
import moment from "moment";

const ca = Config.GENNFT_ADDR;
export const abi = require("/utils/abis/GenerateAssetV2.json");
export const abi_offer_storage = require("/utils/abis/OfferStorage.json");
export const abi_marketplace_storage = require("/utils/abis/MarketplaceStorage.json");

const smartContact = () => {
	return new Contract(ca, abi, connectProvider());
};
const smartContactOfferStorage = () => {
	return new Contract("0xBB0AC558748415C864c5F2F7db71B70C8776BF77", abi_offer_storage, connectProvider());
};
const smartContactMarketplaceStorage = () => {
	return new Contract(Config.MARKETPLACE_ADDR, abi_marketplace_storage, connectProvider());
};

export const getAssetSupply = async () => {
	return ethers.utils.formatUnits(await smartContact().totalSupply(), 0);
};

export const getAsset = async (_filters = []) => {
	// Contract Address 0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53 VELAVERSE ASSET (ASSET)
	let uri = `${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&verify=Y&paginate=NO`;
	// console.log(" === uri ");
	// console.log(uri);

	try {
		let res = await fetch(uri);
		let resJson = await res.json();
		// console.log(" === resJson ");
		// console.log(resJson);

		return resJson;
	} catch (error) {
		console.log("error", error);
	}
};

export const getAssetSummary = async () => {
	let contractMarketplaceStorage = smartContactMarketplaceStorage();

	// GET MARKET ITEMS
	let marketItems = await contractMarketplaceStorage.getItems();
	marketItems = await Promise.all(
		marketItems.map(async (item, index) => {
			return {
				...item,
				token_id: ethers.utils.formatUnits(item._tokenId._hex, 0),
			};
		})
	);
	// console.log("%c === marketItems === ", "color: yellow", marketItems)

	let res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&paginate=NO`);
	// let res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&page=1&size=500`);
	let resJson = await res.json();
	const results = await Promise.all(
		resJson.rows.map(async (asset, index) => {
			let price = 0;
			let items = marketItems.filter((item, index) => {
				return item.token_id == asset.data.asset_token_id;
			});
			if (items.length > 0) {
				price = ethers.utils.formatEther(items[items.length - 1]._price._hex, 0);
			}
			asset.data.price = parseFloat(price);

			return {
				creator_type: asset.data.creator_type,
				asset: asset,
			};
		})
	);
	// console.log("%c === getAssetSummary results ===", "color: yellow", results)

	return results;
};

export const getAssetsByUserWallet = async (_size = 10, _filter = {}) => {
	// GET MARKET ITEMS
	let contractMarketplaceStorage = smartContactMarketplaceStorage();
	let marketItems = await contractMarketplaceStorage.getItems();
	marketItems = await Promise.all(
		marketItems.map(async (item, index) => {
			return {
				...item,
				token_id: ethers.utils.formatUnits(item._tokenId._hex, 0),
				price: parseFloat(ethers.utils.formatEther(item._price._hex, 0)),
			};
		})
	);
	// console.log("%c === getAssetsByUserWallet contractMarketplaceStorage ===", "color: yellow", marketItems)

	let res = await fetch(`/api/asset/get-by-user?page=${_filter.page}&size=${_size}`);
	let resJson = await res.json();

	// เอา null กับ ว่างออก
	resJson.rows = resJson.rows.filter((item, index) => {
		return item._id && item._id.length > 0;
	});

	const result = await Promise.all(
		resJson.rows.map(async (minter, index) => {
			let items = marketItems.filter((item, index) => {
				return item._owner == minter._id;
			});
			let total = items.reduce((element, item) => element + item.price, 0);

			let sold_items = items.filter((item, index) => {
				return item._buyer != "0x0000000000000000000000000000000000000000";
			}); // รายการใหนไม่ใช่ 0x แสดงว่าขายได้แล้ว
			let sold_total = sold_items.reduce((element, item) => element + item.price, 0);

			// GET CREATOR TYPE
			let creator_type = "creator"; // official | creator
			if (Config.OFFICIAL_WALLETS.includes(minter._id)) creator_type = "official";

			return {
				...minter,
				total: total,
				sold_items: sold_items,
				sold_total: sold_total,
				creator_type: creator_type,
			};
		})
	);
	console.log("%c === getAssetsByUserWallet result ===", "color: yellow", result);

	return result;
};

export const getAssetsByPage = async (_size = 10, _filter = {}) => {
	let url = `/api/asset/gets?page=${_filter.page}&size=${_size}`;
	if (_filter.creator_type) url += `&creator_type=${_filter.creator_type}`;
	if (_filter.mint_date) url += `&mint_date=${_filter.mint_date}`;
	if (_filter.wallet_minted) url += `&wallet_minted=${_filter.wallet_minted}`;
	if (_filter.asset_token_id) url += `&asset_token_id=${_filter.asset_token_id}`;
	if (_filter.name) url += `&name=${_filter.name}`;
	if (_filter.sold_status) url += `&sold_status=${_filter.sold_status}`;
	if (_filter.sold_date) url += `&sold_date=${_filter.sold_date}`;
	if (_filter.owner_wallet) url += `&owner_wallet=${_filter.owner_wallet}`;
	// console.log("%c === getAssetsByPage url ===", "color: yellow", url)

	let res = await fetch(url);
	let resJson = await res.json();
	// console.log("%c === getAssets resJson.rows ===", "color: yellow", resJson.rows)

	const result = await Promise.all(
		resJson.rows.map(async (item, index) => {
			// GET ASSET PRICE
			let contractMarketplaceStorage = smartContactMarketplaceStorage();
			let price = 0;
			let resMarketId = await contractMarketplaceStorage.getMarketId(Config.GENNFT_ADDR, item.data.owner_wallet, item.data.asset_token_id, 1, true);
			let marketId = ethers.utils.formatUnits(resMarketId[1], 0);
			if (marketId > 0) {
				let resItemInfo = await contractMarketplaceStorage._getItemInfo(marketId);
				price = ethers.utils.formatEther(resItemInfo[1]._price._hex, 0);
				// console.log("%c === price "+item.data.asset_token_id+" "+marketId+" ", "color: orange", price)
			}

			item.data.soldDate = item.data.sold_status ? moment(item.data.sold_date).format("DD/MM/YYYY HH:mm") : "-";
			item.data.soldStatus = item.data.sold_status ? "sold" : "-";
			item.data.mintedDate = item.data.mint_date ? moment(item.data.mint_date).format("DD/MM/YYYY HH:mm") : "-";

			return {
				...item,
				price: price,
			};
		})
	);
	// console.log("%c === getAssetsByPage results ===", "color: yellow", result)

	return result;
};

export const syncAsset = async (_page, _size) => {
	let res;
	let resJson;
	if (_page || _size) {
		// let res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&paginate=NO`);
		res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&page=${_page}&size=${_size}`);
	} else {
		res = await fetch(`/api/asset/sync-wait`);
	}
	resJson = await res.json();
	if (resJson.rows.length == 0) return;

	let provider = connectProvider();
	let lastestBlock = await provider.getBlock();

	let contract = smartContact();
	let contractOfferStorage = smartContactOfferStorage();
	let contractMarketplaceStorage = smartContactMarketplaceStorage();

	// GET ALL MINTED NTF
	let filters = contract.filters.EventMinted();
	let queryFilters = await contract.queryFilter(filters, 0, lastestBlock.number);
	// console.log("%c === queryFilters === ", "color: yellow", queryFilters)

	// GET ALL BOUGHT NFT
	let offerStorageFilters = contractOfferStorage.filters.BuyItem();
	let offerStorageQueryFilters = await contractOfferStorage.queryFilter(offerStorageFilters, 0, lastestBlock.number);
	// console.log("%c === offerStorageQueryFilters === ", "color: yellow", offerStorageQueryFilters)

	const results = await Promise.all(
		resJson.rows.map(async (asset, index) => {
			// console.log(_page, index)

			// console.log("%c === asset === ", "color: orange", asset)

			let owner_of = await contract.ownerOf(asset.token);
			// console.log("%c === owner_of === ", "color: yellow", owner_of)

			// GET ONCHAIN INFO
			let onchain = queryFilters.filter((item, index) => {
				return item.args._tokenId == parseInt(asset.token);
			});
			let onchain_transaction = await onchain[0].getTransaction();
			// let onchain_transaction_receipt = await onchain[0].getTransactionReceipt()
			// console.log("%c === onchain === ", "color: yellow", onchain)
			// console.log("%c === onchain_transaction === ", "color: yellow", onchain_transaction)
			// console.log("%c === onchain_transaction_receipt === ", "color: yellow", onchain_transaction_receipt)

			// GET OFFER ONCHAIN INFO
			let sold_status = false;
			let sold_date = "";
			let offer_onchain = offerStorageQueryFilters.filter((item, index) => {
				return ethers.utils.formatUnits(item.args.tokenId._hex, 0) == parseInt(asset.token);
			});
			if (offer_onchain.length > 0) {
				// console.log("%c === offer_block === ", "color: yellow", index, offer_block)
				let offer_block = await provider.getBlock(offer_onchain[0].blockNumber);
				sold_status = true;
				sold_date = new Date(offer_block.timestamp * 1000);
			}

			// GET METADATA
			let metadata = {};
			let res_metadata = await fetch(asset.metadata, { method: "GET" });
			if (res_metadata.ok) metadata = await res_metadata.json();
			// console.log("%c === metadata === ", "color: yellow", metadata)

			// GET COLLECTION
			let collection = {};
			let res_collection = await fetch(`${Config.COLLECTION_URI}/collections/asset/${asset._id}`);
			if (res_collection.ok) collection = await res_collection.json();
			// console.log("%c === collection === ", "color: yellow", collection)

			// GET CREATOR TYPE
			let creator_type = "creator"; // official | creator
			if (Config.OFFICIAL_WALLETS.includes(onchain[0].args._owner)) creator_type = "official";

			return {
				asset_id: asset._id,
				creator_type: creator_type,
				mint_date: asset.createdAt,
				wallet_minted: onchain[0].args._owner,
				asset_token_id: asset.token,
				name: metadata.name,
				asset_image: asset.image,
				sold_status: sold_status,
				sold_date: sold_date,
				owner_wallet: owner_of,
				mint_fee: ethers.utils.formatEther(onchain_transaction.gasPrice._hex),
			};
		})
	);
	console.log("%c === results ===", "color: yellow", results);

	if (results.length > 0) {
		let _body = JSON.stringify({
			results: results,
		});
		let _res_insert = await fetch("/api/asset/sync", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Cache-Control": "no-cache",
			},
			body: _body,
		});
		console.log("%c === _res_insert ===", "color: yellow", _res_insert);
	}

	return results;
};
