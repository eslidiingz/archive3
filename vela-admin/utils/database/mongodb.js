import { MongoClient } from "mongodb";

export default mc = async () => {
	try {
		return await MongoClient.connect(
			"mongodb://root:pass12345@159.223.53.144:27017/admin?retryWrites=true&w=majority"
		);
	} catch (error) {
		return null;
	}
};
