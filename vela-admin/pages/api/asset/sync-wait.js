import { MongoClient } from "mongodb";
const ObjectId = require('mongodb').ObjectId;

const MONGODB_CONNECTION_PROD = process.env.MONGODB_CONNECTION_PROD;
const GENNFT_ADDR = process.env.GENNFT_ADDR;

export default async function handler(req, res) {

	const client = await MongoClient.connect(MONGODB_CONNECTION_PROD)
	const db = client.db("velaverse")

	let where = {
		"address": GENNFT_ADDR,
		"data": { $exists: false }
	}
	let rows = await db.collection('assets').find(where).toArray()
	// console.log("%c === rows ===", "color: yellow", rows)

	res.status(200).json({
		rows: rows,
	})

}
