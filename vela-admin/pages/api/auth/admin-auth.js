import { MongoClient } from "mongodb";
import { hash, compare } from "bcryptjs";

export default async function handler(req, res) {
	const client = await MongoClient.connect(
		"mongodb://root:pass12345@159.223.53.144:27017/admin?retryWrites=true&w=majority"
	);
	const db = client.db("velaverse");

	var data = {
		username: req.body.username,
	};
	let rs = await db.collection("admin_users").findOne(data);
	if (!rs) {
		res.status(200).json({
			status: false,
			data: rs,
			message: "User not found"
		});
		return 0
	}

	let isPasswordValid = await compare(req.body.password, rs.password);
	if (!isPasswordValid) {
		res.status(200).json({
			status: false,
			data: rs,
			message: "Invalid Password"
		});
		return 0
	}

	res.status(200).json({
		status: true,
		data: rs,
		message: `Welcome back ${rs.name}`
	});
}
