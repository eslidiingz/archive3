import { MongoClient } from "mongodb";

export default async function handler(req, res) {

	// const client = await MongoClient.connect(process.env.MONGO_DB_CONN);
	const client = await MongoClient.connect('mongodb+srv://mip:faOcdK5vCayj8XGQ@cluster0.ovprs.mongodb.net/mip_p2p?retryWrites=true&w=majority');
	const db = client.db();

	db.collection("payso_session").findOne({
		refno: req.body.refno
	}, function(err, result) {
		if (err) throw err;
		console.log(result);
		res.status(200).json(result);
	});

}