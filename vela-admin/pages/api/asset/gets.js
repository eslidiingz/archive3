/** @format */

import { MongoClient } from "mongodb";
const ObjectId = require("mongodb").ObjectId;
const ISODate = require("mongodb").ISODate;

const MONGODB_CONNECTION_PROD = process.env.MONGODB_CONNECTION_PROD;
const GENNFT_ADDR = process.env.GENNFT_ADDR;

export default async function handler(req, res) {
	let page = parseInt(req.query.page);
	page = isNaN(page) ? null : page;
	let size = parseInt(req.query.size);
	size = isNaN(size) ? null : size;
	let offset = size * (page - 1);
	offset = isNaN(offset) ? null : offset;

	const client = await MongoClient.connect(MONGODB_CONNECTION_PROD);
	const db = client.db("velaverse");

	let where = {
		address: GENNFT_ADDR,
	};

	// FILTER
	if (req.query.creator_type) where["data.creator_type"] = req.query.creator_type;
	if (req.query.mint_date) {
		let date_end = new Date(req.query.mint_date);
		date_end.setDate(date_end.getDate() + 1);
		where["data.mint_date"] = { $gte: new Date(req.query.mint_date), $lt: date_end };
	}
	if (req.query.wallet_minted) where["data.wallet_minted"] = req.query.wallet_minted;
	if (req.query.asset_token_id) where["data.asset_token_id"] = req.query.asset_token_id;
	if (req.query.name) where["data.name"] = { $regex: req.query.name };
	if (req.query.sold_status) where["data.sold_status"] = req.query.sold_status == "true" ? true : false;
	if (req.query.sold_date) {
		let date_end = new Date(req.query.sold_date);
		date_end.setDate(date_end.getDate() + 1);
		where["data.sold_date"] = { $gte: new Date(req.query.sold_date), $lt: date_end };
	}
	if (req.query.owner_wallet) where["data.owner_wallet"] = req.query.owner_wallet;
	let rows = [];

	if (!page || !size ) {
		rows = await db.collection("assets").find(where).sort({ createdAt: -1 }).toArray();
	} else {
		rows = await db.collection("assets").find(where).sort({ createdAt: -1 }).limit(size).skip(offset).toArray();
	}

	// console.log("%c === rows ===", "color: yellow", rows)

	res.status(200).json({
		rows: rows,
	});
}
