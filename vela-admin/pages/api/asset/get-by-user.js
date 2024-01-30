import { MongoClient } from "mongodb";
const ObjectId = require('mongodb').ObjectId;
const ISODate = require('mongodb').ISODate;

const MONGODB_CONNECTION_PROD = process.env.MONGODB_CONNECTION_PROD;
const GENNFT_ADDR = process.env.GENNFT_ADDR;

export default async function handler(req, res) {

	const page = parseInt(req.query.page)
	const size = parseInt(req.query.size)
    const offset = size * (page - 1)

	const client = await MongoClient.connect(MONGODB_CONNECTION_PROD)
	const db = client.db("velaverse")

	let config = [
		{
			$group: {
				_id: "$data.wallet_minted",
				count: { $sum: 1 }
			}
		},
		{ $sort: { count: -1 } }
	]
	if( size > 0 ){
		config.push({ $limit: offset + size + 1 })
		config.push({ $skip: offset + 1 })
	}
	let rows = await db.collection('assets').aggregate(config).toArray()

	res.status(200).json({
		rows: rows,
	})

}
