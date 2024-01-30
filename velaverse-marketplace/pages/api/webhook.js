import { MongoClient } from "mongodb";

export default async function handler(req, res) {

	const client = await MongoClient.connect('mongodb+srv://mip:faOcdK5vCayj8XGQ@cluster0.ovprs.mongodb.net/mip_p2p?retryWrites=true&w=majority');
	const db = client.db();

	var values = {
		raw_headers: req.rawHeaders,
		body: req.body,
		created_at: new Date().getTime()
	};
	let rs = await db.collection("payso_trans_success").insertOne(values);
	let id = rs.insertedId.toString();

	res.status(200).json({ insertedId: id })

}