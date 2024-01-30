import { MongoClient } from "mongodb";

export default async function handler(req, res) {

	const client = await MongoClient.connect('mongodb://root:pass12345@159.223.53.144:27017/admin?retryWrites=true&w=majority');
	const db = client.db("velaverse");

	var data = {
		...req.body,
		created_at: new Date().getTime(),
	};
	let rs = await db.collection("admin_users").insertOne(data);
	let id = rs.insertedId.toString();

	res.status(200).json({
		insertedId: id,
	})

}
