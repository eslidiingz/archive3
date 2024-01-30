import { MongoClient } from "mongodb";
const ObjectId = require('mongodb').ObjectId;

const mongodb_connection_prod = process.env.MONGODB_CONNECTION_PROD;

export default async function handler(req, res) {

	const client = await MongoClient.connect(mongodb_connection_prod);
	const db = client.db("velaverse");

	let datas = await Promise.all(req.body.results.map(async (data, index) => {

		data.mint_date = new Date(data.mint_date)
		data.sold_date = new Date(data.sold_date)

		let res_updated = await db.collection('assets').updateOne(
			{
				_id: new ObjectId(data.asset_id),
			},
			{
				$set: {
					data: data
				}
			}
		);
		console.log("%c === res_updated ===", "color: yellow", res_updated)

		return {
			...data,
			created_at: new Date().getTime(),
			updated_at: new Date().getTime()
		}

	}))
	// console.log("%c === datas ===", "color: yellow", datas)

	// let rs = await db.collection("asset_trans").insertMany(datas);

	res.status(200).json({
		datas: datas,
	})

}
