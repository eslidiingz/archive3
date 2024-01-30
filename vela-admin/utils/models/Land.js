
import Config from "/configs/config";
import { ethers, Contract } from "ethers";
import { connectProvider } from "../connector/provider";
import { getGql } from "./gql";
import { arrayUnique } from "/utils/global";
import dayjs from "dayjs";
import moment from "moment"

const ca = Config.LAND_YAAMO_ADDR;
const caTransfer = Config.LAND_TRANSFER_ADDR;

export const abi = require("/utils/abis/abi.json"); // velaverse abi

const smartContact = (_contractAddress = ca) => {
	let _ca = _contractAddress ? _contractAddress : ca;

	const web3Provider = connectProvider();
	const signer = web3Provider.getSigner();

	return new Contract(_ca, abi, signer);
};

export const getLandSupply = async (_contractAddress = ca) => {
	return ethers.utils.formatUnits(
		await smartContact(_contractAddress).totalSupply(),
		0
	);
};

export const getLandByMonth = async (_contractAddress = ca, _year, _month) => {

	// console.log("%c === getLandByMonth ", "color: orange")

	let dateStart = dayjs(`${_year}-${_month}-01`).format(`${_year}-${_month}-01 00:00:00`);
	let dateEnd = dayjs(`${_year}-${_month}-01`).endOf('month').format(`${_year}-${_month}-DD 23:59:59`);

	const _query = `
		eve_log2(where: {_and: {created_at: {_gt: "${dateStart}", _lte: "${dateEnd}"}, sm_addr: {_eq: "${_contractAddress}"}}}) {
			sm_addr
			own_addr
			token_id
			x
			y
			type
			created_at
			updated_at
		}
	`;
	// console.log("%c =========== query ===========", "color: yellow");
	// console.log(_query);
	const _res = await getGql(_query);
	// console.log(_res)

	return _res.eve_log2;

};

export const getAllLand = async (_contractAddress = ca, _filters = {}) => {

	const _query = `
		eve_log2 (
			where: {
				_and: {
					sm_addr: {_eq: "${_contractAddress}"},
					created_at: {_gte: "${_filters.dateStart}", _lte: "${_filters.dateEnd}"}
				}
			}
			order_by: {token_id: desc},
		) {
			sm_addr
			own_addr
			token_id
			x
			y
			type
			created_at
			updated_at
		}
	`;
	// console.log("%c =========== query ===========", "color: yellow");
	// console.log(_query);

	const _res = await getGql(_query);

	return _res.eve_log2;
};

export const getAllLandPast = async (_contractAddress = ca, _filters = {}) => {

	const _query = `
		eve_log2 (
			where: {
				_and: {
					sm_addr: {_eq: "${_contractAddress}"},
					created_at: {_lte: "${_filters.dateEnd}"}
				}
			}
			order_by: {token_id: desc},
		) {
			sm_addr
			own_addr
			token_id
			x
			y
			type
			created_at
			updated_at
		}
	`;
	console.log("%c =========== query ===========", "color: yellow");
	console.log(_query);

	const _res = await getGql(_query);

	return _res.eve_log2;
};

export const getlandTransfered = async (_contractAddress = ca) => {

	let provider = connectProvider();
	let contract = smartContact(_contractAddress);

	let filters = contract.filters.landTransfered();

	let queryFilters = await contract.queryFilter(filters, 0, "latest");
	console.log("%c ========== queryFilters ==========", "color: lime");
	console.log(queryFilters);

	const results = await Promise.all(queryFilters.map(async (item, index) => {

		let block = await provider.getBlock(item.blockNumber);
		var date = new Date(block.timestamp * 1000);

		return {
			date: date
		}
	}));
	console.log("%c ========== getlandTransfered results ========== ", "color: cyan");
	console.log(results);

	return results

}

export const getBuyLandWalletSummary = async (_contractAddress = ca, limit = 0) => {

	let provider = connectProvider();
	let contract = smartContact(_contractAddress);

	let filters = contract.filters.landTransfered();

	let lastestBlock = await provider.getBlock();

	let queryFilters = await contract.queryFilter(filters, 0, lastestBlock.number);
	// console.log("%c ========== transactions ========== "+_contractAddress+" ====== ", "color: green");
	// console.log(queryFilters);

	let wallets = await Promise.all(queryFilters.map(async (item, index) => {
		return item.args.wallet
	}));
	wallets = arrayUnique(wallets);

	let results = await Promise.all(wallets.map(async (wallet, index_wallet) => {

		let transactions = queryFilters.filter((item, index) => { return item.args.wallet == wallet })

		let total_amount = transactions.reduce((element, item) => element + item.args.tokenId.length, 0)

		// GET CREATOR TYPE
		let creator_type = "creator" // official | creator
		if( Config.OFFICIAL_WALLETS.includes(wallet) ) creator_type = "official"

		return {
			creator_type: creator_type,
			wallet: wallet,
			amount: total_amount,
			total: total_amount * 100 // 100 Class Per Land
		}

	}));

	// SORT BY AMOUNT DESC
	results.sort(function(a, b) {
		return b["amount"] - a["amount"];
	});

	console.log("%c ========== getBuyLandWalletSummary results ========== "+_contractAddress+" ====== ", "color: yellow");
	console.log(results);

	return results

};

export const getBuyLandLatest = async (_contractAddress = ca, limit = 0) => {

	// console.log("%c ========== _contractAddress ==========", "color: orange");
	// console.log(_contractAddress)

	let provider = connectProvider();
	let contract = smartContact(_contractAddress);

	let filters = contract.filters.landTransfered();
	// console.log("%c ========== filters ==========", "color: skyblue");
	// console.log(filters);

	let lastestBlock = await provider.getBlock();
	// console.log("%c ========== lastestBlock ==========", "color: red");
	// console.log(lastestBlock);

	let i_max = Math.ceil(lastestBlock.number / 100000);
	let toBlock = lastestBlock.number;
	let transactions = [];
	for (let i = 1; i <= i_max; i++) {
		let fromBlock = lastestBlock.number - 100000 * i;
		if (fromBlock < 0) fromBlock = 0;
		// console.log(" === fromBlock ", fromBlock);
		let queryFilters = await contract.queryFilter(
			filters,
			fromBlock,
			toBlock
		);
		transactions.push(...queryFilters);

		if (transactions.length > 10) {
			break;
		}

		toBlock = fromBlock;

	}
	console.log("%c ========== transactions ========== "+_contractAddress+" ====== ", "color: green");
	console.log(transactions);

	const results = await Promise.all(transactions.map(async (item, index) => {
		let block = await provider.getBlock(item.blockNumber);
		var date = new Date(block.timestamp * 1000);

		return {
			block: item.blockNumber,
			date: moment(date).format("DD/MM/YYYY HH:mm"),
			amount: item.args.tokenId.length,
			wallet: item.args.wallet
		}
	}));
	console.log("%c ========== results ========== "+_contractAddress+" ====== ", "color: green");
	console.log(results);

	return results

};

export const getAssets = async (_contractAddress = ca, limit = 0) => {

	try {

		// GET ASSET TRANSACTIONS
		let _res = await fetch(`${Config.COLLECTION_URI}/assets`, {
			method: "GET",
		});
		let _resjson = await _res.json();

		// GET UNIQUE HASH
		let hashlists = await Promise.all(_resjson.rows.map(async (item, index) => {
			return item.hash
		}));
		hashlists = arrayUnique(hashlists);

		// GET METADATA FROM HASH
		let metadata = await Promise.all(hashlists.map(async (item, index) => {
			let ipfs_link = `https://cdn.velaverse.io/hash/${item}`
			let _metadata = await fetch(ipfs_link, {
				method: "GET",
			});
			if(_metadata.ok){
				_metadata = await _metadata.json();
				return _metadata
			}else{
				return {}
			}
			console.log("%c ========== _metadata ========== ", "color: orange");
			console.log(_metadata);
		}));
		console.log("%c ========== metadata ========== ", "color: lime");
		console.log(metadata);

		let results = await Promise.all(_resjson.rows.map(async (item, index) => {
			return {
				name: "",
				date: moment(item.createdAt).format("DD/MM/YYYY HH:mm"),
				collection: "",
				price: ""
			}
		}));
		console.log("%c ========== results ========== ", "color: lime");
		console.log(results);

		return results

	} catch (error) {
		console.log(" === error ", error);
	}

};
