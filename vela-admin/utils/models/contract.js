import { ethers, Contract } from "ethers"
import { connectProvider } from "utils/connector/provider"

import Config from "/configs/config"
export const contractAddress = Config.LAND_YAAMO_ADDR // contract หลัก
export const contractAddressTransfer = Config.LAND_TRANSFER_ADDR // contract เอาไว้โอน

export const abi = require("/utils/abis/abi.json") // velaverse abi
export const abi_transfer = require("/utils/abis/transfer.json") // transfer abi

export const smartContact = (abi = abi, _contractAddress = contractAddress) => {
	let _ca = _contractAddress ? _contractAddress : contractAddress

	const web3Provider = connectProvider()
	const signer = web3Provider.getSigner()

	return new Contract(_ca, abi, signer)
}

export const getLandSupply = async (_contractAddress = ca) => {
	return ethers.utils.formatUnits( await smartContact(abi, _contractAddress).totalSupply(), 0 )
}

export const getAllLand = async (_contractAddress = ca, _filters = {}) => {
	let filterDate = ``

	if (_filters.period == "daily") {
		filterDate = `created_at: {_gte: "${_filters.dateStart}"}`
	} else if (_filters.period == "weekly") {
		filterDate = `created_at: {_gte: "${_filters.dateStart}",}`
	} else if (_filters.period == "monthly") {
		filterDate = `created_at: {_gte: "${_filters.dateStart}",}`
	}

	const _query = `
		eve_log2 (
			where: {
				sm_addr: {_eq: "${_contractAddress}"},
				${filterDate}
			},
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
	`
	// console.log("%c =========== query ===========", "color: yellow")
	// console.log(_query)
	const _res = await getGql(_query)

	return _res.eve_log2
}

export const getBuyLandLatest = async (_contractAddress = ca, limit = 0) => {
	// 0xedf64ef78f5e9831ff980eebcc689c9568f68be5
	// filterFrom = daiContract.filters.Transfer(myAddress, null)

	let _sm = smartContact(abi, _contractAddress).filter.topics(
		"0xedf64ef78f5e9831ff980eebcc689c9568f68be5"
	)

	let provider = connectProvider()

	let _filter = provider.filte.address()

	// console.log("provider", provider)
	// console.log("_filter", _filter)
	// console.log("_sm", _sm)
}

export const transferLand = async (data = {}, _contractAddress = ca) => {
	let _res = await Promise.all(data.token_id.map(async (token_id, index) => {
		return await smartContact(abi, _contractAddress).safeTransferFrom(data.admin_wallet_address, data.wallet_address, token_id)
	}))

	console.log(" === transferLand _res")
	console.log(_res)

	return true
}

export const transferAllLand = async (data = {}, _contractAddress = ca, callback) => {

	try {

		// ALLOW OLDTOWN CONTRACT TO CONTRACT ANOTHER CONTRACTS
		let contract = smartContact(abi, _contractAddress)
		let isApproved = await contract.isApprovedForAll(data.admin_wallet_address, contractAddressTransfer)
		if( !isApproved ) await contract.setApprovalForAll(contractAddressTransfer, true) // approve ให้ contract ใหม่
		// ALLOW OLDTOWN CONTRACT TO CONTRACT ANOTHER CONTRACTS END

		let contractTransfer = smartContact(abi_transfer, contractAddressTransfer)

		// ALLOW LAND CONTRACT TO CONTACT WITH OLDTOWN CONTRACTS
		let contractTransferInterface = await contractTransfer.iTransfer()
		if( contractTransferInterface != _contractAddress ) await contractTransfer.setInterface(_contractAddress)
		// ALLOW LAND CONTRACT TO CONTACT WITH OLDTOWN CONTRACTS END

		contractTransfer.on("landTransfered", (from, to, tokenId) => {
			callback()
		})
		await contractTransfer.transferAll(data.admin_wallet_address, data.wallet_address, data.token_id)

	} catch (error) {
		console.log(" === error ", error)
	}

	return true

}
