import { ethers, Contract } from "ethers";
import { connectProvider } from "../connector/provider";
import Config from "../../configs/config";

const ca = Config.GENNFT_ADDR;
export const abi = require("/utils/abis/GenerateAssetV2.json");
export const abi_offer_storage = require("/utils/abis/OfferStorage.json");
export const abi_marketplace_storage = require("/utils/abis/MarketplaceStorage.json");

const official_wallet = [
	"0x8e37A8294e866da31991EE1A097E5049Af3aFA85",
	"0xC838C64519fd98Fc205A32F2306cD3cf39BbB267",
	"0x1a07090067fe01A1b5Bf2EFED4D376517e5b71Ea",
	"0xc514b57Be642a782342439D74EA598B0A2994359",
	"0x9B5C850A7161f56d7E2235a74E69EeEB44431A1b"
];

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

	let provider = connectProvider();
	let lastestBlock = await provider.getBlock();

	let contract = smartContact();

	// GET ALL MINTED NTF
	let filters = contract.filters.EventMinted();
	let queryFilters = await contract.queryFilter(filters, 0, lastestBlock.number);
	// console.log("%c === queryFilters === ", "color: yellow", queryFilters)

	let res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&paginate=NO`);
	let resJson = await res.json();
	const results = await Promise.all(resJson.rows.map(async (asset, index) => {

		// GET ONCHAIN INFO
		let onchain = queryFilters.filter((item, index) => { return item.args._tokenId == parseInt(asset.token) })

		// GET CREATOR TYPE
		let creator_type = "creator" // official | creator
		if( official_wallet.includes(onchain[0].args._owner) ) creator_type = "official"

		return {
			creator_type: creator_type,
			asset: asset
		}

	}));
	console.log("%c === getAssetSummary results ===", "color: yellow", results)

	return results

}

export const getAssetsAttr = async ( _page = 1, _size = 10, _filter = {} ) => {

	let url = `/api/asset/gets?page=${_page}&size=${_size}`
	if( _filter.creator_type ) url += `&creator_type=${_filter.creator_type}`
	if( _filter.mint_date ) url += `&mint_date=${_filter.mint_date}`
	if( _filter.wallet_minted ) url += `&wallet_minted=${_filter.wallet_minted}`
	if( _filter.asset_token_id ) url += `&asset_token_id=${_filter.asset_token_id}`
	if( _filter.name ) url += `&name=${_filter.name}`
	if( _filter.sold_status ) url += `&sold_status=${_filter.sold_status}`
	if( _filter.sold_date ) url += `&sold_date=${_filter.sold_date}`
	if( _filter.owner_wallet ) url += `&owner_wallet=${_filter.owner_wallet}`
	// console.log("%c === getAssetsByPage url ===", "color: yellow", url)

	let res = await fetch(url);
	let resJson = await res.json();
	// console.log("%c === getAssets resJson.rows ===", "color: yellow", resJson.rows)

	return resJson.rows

}
export const getAssetsByPage = async ( _size = 10, _filter = {} ) => {

	let url = `/api/asset/gets?page=${_filter.page}&size=${_size}`
	if( _filter.creator_type ) url += `&creator_type=${_filter.creator_type}`
	if( _filter.mint_date ) url += `&mint_date=${_filter.mint_date}`
	if( _filter.wallet_minted ) url += `&wallet_minted=${_filter.wallet_minted}`
	if( _filter.asset_token_id ) url += `&asset_token_id=${_filter.asset_token_id}`
	if( _filter.name ) url += `&name=${_filter.name}`
	if( _filter.sold_status ) url += `&sold_status=${_filter.sold_status}`
	if( _filter.sold_date ) url += `&sold_date=${_filter.sold_date}`
	if( _filter.owner_wallet ) url += `&owner_wallet=${_filter.owner_wallet}`
	// console.log("%c === getAssetsByPage url ===", "color: yellow", url)

	let res = await fetch(url);
	let resJson = await res.json();
	// console.log("%c === getAssets resJson.rows ===", "color: yellow", resJson.rows)

	const result = await Promise.all(resJson.rows.map(async (item, index) => {

		// GET ASSET PRICE
		let contractMarketplaceStorage = smartContactMarketplaceStorage();
		let price = 0
		let resMarketId = await contractMarketplaceStorage.getMarketId(Config.GENNFT_ADDR, item.data.owner_wallet, item.data.asset_token_id, 1, true)
		let marketId = ethers.utils.formatUnits(resMarketId[1], 0)
		if( marketId > 0 ){
			let resItemInfo = await contractMarketplaceStorage._getItemInfo(marketId)
			price = ethers.utils.formatEther(resItemInfo[1]._price._hex, 0)
			console.log("%c === price "+item.data.asset_token_id+" "+marketId+" ", "color: orange", price)
		}

		return {
			...item,
			price: price
		}

	}));

	console.log(result)

	return result

}

export const syncAsset = async (_page, _size) => {

	let res
	let resJson
	if( _page || _size ){
		// let res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&paginate=NO`);
		res = await fetch(`${Config.COLLECTION_URI}/assets?address=0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53&page=${_page}&size=${_size}`);
	}else{
		res = await fetch(`/api/asset/sync-wait`);
	}
	resJson = await res.json();
	if( resJson.rows.length == 0 ) return

	let provider = connectProvider();
	let lastestBlock = await provider.getBlock();

	let contract = smartContact();
	let contractOfferStorage = smartContactOfferStorage();

	// GET ALL MINTED NTF
	let filters = contract.filters.EventMinted();
	let queryFilters = await contract.queryFilter(filters, 0, lastestBlock.number);
	// console.log("%c === queryFilters === ", "color: yellow", queryFilters)

	// GET ALL BOUGHT NFT
	let offerStorageFilters = contractOfferStorage.filters.BuyItem();
	let offerStorageQueryFilters = await contractOfferStorage.queryFilter(offerStorageFilters, 0, lastestBlock.number);
	// console.log("%c === offerStorageQueryFilters === ", "color: yellow", offerStorageQueryFilters)

	const results = await Promise.all(resJson.rows.map(async (asset, index) => {

		// console.log(_page, index)

		// console.log("%c === asset === ", "color: orange", asset)

		let owner_of = await contract.ownerOf(asset.token)
		// console.log("%c === owner_of === ", "color: yellow", owner_of)

		// GET ONCHAIN INFO
		let onchain = queryFilters.filter((item, index) => { return item.args._tokenId == parseInt(asset.token) })
		let onchain_transaction = await onchain[0].getTransaction()
		// let onchain_transaction_receipt = await onchain[0].getTransactionReceipt()
		// console.log("%c === onchain === ", "color: yellow", onchain)
		// console.log("%c === onchain_transaction === ", "color: yellow", onchain_transaction)
		// console.log("%c === onchain_transaction_receipt === ", "color: yellow", onchain_transaction_receipt)

		// GET OFFER ONCHAIN INFO
		let sold_status = false
		let sold_date = ""
		let offer_onchain = offerStorageQueryFilters.filter((item, index) => { return ethers.utils.formatUnits(item.args.tokenId._hex, 0) == parseInt(asset.token) })
		if( offer_onchain.length > 0 ){
			// console.log("%c === offer_block === ", "color: yellow", index, offer_block)
			let offer_block = await provider.getBlock(offer_onchain[0].blockNumber);
			sold_status = true
			sold_date = new Date(offer_block.timestamp * 1000);
		}

		// GET METADATA
		let metadata = {}
		let res_metadata = await fetch(asset.metadata, { method: "GET" });
		if( res_metadata.ok ) metadata = await res_metadata.json();
		// console.log("%c === metadata === ", "color: yellow", metadata)

		// GET COLLECTION
		let collection = {}
		let res_collection = await fetch(`${Config.COLLECTION_URI}/collections/asset/${asset._id}`);
		if( res_collection.ok ) collection = await res_collection.json()
		// console.log("%c === collection === ", "color: yellow", collection)

		// GET CREATOR TYPE
		let creator_type = "creator" // official | creator
		if( official_wallet.includes(onchain[0].args._owner) ) creator_type = "official"

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
			mint_fee: ethers.utils.formatEther(onchain_transaction.gasPrice._hex)
		}

	}));
	console.log("%c === results ===", "color: yellow", results)

	if( results.length > 0 ){

		let _body = JSON.stringify({
			results: results,
		});
		let _res_insert = await fetch("/api/asset/sync", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Cache-Control": "no-cache",
			},
			body: _body,
		});
		console.log("%c === _res_insert ===", "color: yellow", _res_insert)

	}

	return results;

};
