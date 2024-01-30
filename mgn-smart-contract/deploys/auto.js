const hre = require("hardhat");

async function main() {
	let address = {};

	// Token
	const contractToken = await hre.ethers.getContractFactory("Token");
	const deployToken = await contractToken.deploy();
	await deployToken.deployed();
	address.token = deployToken.address;
	try {
		await hre.run("verify:verify", { address: address.token });
	} catch (e) {}

	//fixed token
	// address.token = "0x3a8E8f07036205a492624F6E880bbC1a0ade4833";

	// Land
	const contractLand = await hre.ethers.getContractFactory("Land");
	const deployLand = await contractLand.deploy(address.token);
	await deployLand.deployed();
	address.land = deployLand.address;
	try {
		await hre.run("verify:verify", {
			address: address.land,
			constructorArguments: [address.token],
		});
	} catch (e) {}

	// Whitelist
	const contractWhitelist = await hre.ethers.getContractFactory("Whitelist");
	const deployWhitelist = await contractWhitelist.deploy(address.token);
	await deployWhitelist.deployed();
	address.whitelist = deployWhitelist.address;
	try {
		await hre.run("verify:verify", {
			address: address.whitelist,
			constructorArguments: [address.token],
		});
	} catch (e) {}

	// Marketplace
	const contractMarketplace = await hre.ethers.getContractFactory(
		"Marketplace"
	);
	const deployMarketplace = await contractMarketplace.deploy(address.whitelist);
	await deployMarketplace.deployed();
	address.marketplace = deployMarketplace.address;
	try {
		await hre.run("verify:verify", {
			address: address.marketplace,
			constructorArguments: [address.whitelist],
		});
	} catch (e) {}

	// Auction
	const contractAuction = await hre.ethers.getContractFactory("Auction");
	const deployAuction = await contractAuction.deploy(address.whitelist);
	await deployAuction.deployed();
	address.auction = deployAuction.address;
	try {
		await hre.run("verify:verify", {
			address: address.auction,
			constructorArguments: [address.whitelist],
		});
	} catch (e) {}

	// Generate
	const contractGenerate = await hre.ethers.getContractFactory("Generate");
	const deployGenerate = await contractGenerate.deploy();
	await deployGenerate.deployed();
	address.generate = deployGenerate.address;
	try {
		await hre.run("verify:verify", { address: address.generate });
	} catch (e) {}

	// // Factory
	// const contractFactory = await hre.ethers.getContractFactory("Factory");
	// const deployFactory = await contractFactory.deploy(
	// 	address.token,
	// 	address.land
	// );
	// await deployFactory.deployed();
	// address.factory = deployFactory.address;
	// try {
	// 	await hre.run("verify:verify", {
	// 		address: deployFactory.address,
	// 		constructorArguments: [address.token, address.land],
	// 	});
	// } catch (e) {}

	// // Minter role
	// // 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6 (MINTER_ROLE)
	// await deployLand.grantRole(
	// 	"0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
	// 	address.factory
	// );
	// let hasRole = await deployLand.hasRole(
	// 	"0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
	// 	address.factory
	// );
	// console.log("hasRole", hasRole);

	//Mint token
	const addressWallet = [
		{ address: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C", name: "MEX" },
		{ address: "0x782beb424B3B39a73f48738c19CAE82Ff9F17549", name: "ESDZ" },
		{ address: "0x14eD29438789299b0C69f698e9C9ea4B40e49625", name: "SPAK" },
		{ address: "0x000B112d94271A55A186F65798396F010DF03Ba6", name: "XPOP" },
		{ address: "0x2d4D981813330B390EA73ffd28C587A785e44224", name: "MinusOne" },
		{ address: "0x8D6fd4c22102eb51D5c5f1e1B6112AF5F4d6d9c3", name: "AOM" },
		{ address: "0x0203Fb006c0D2e1466D8765F3Ce664bCde10e755", name: "Ter" },
		{ address: "0x7E1494B8EcF5d853829aD0e0D710340aFd217C98", name: "Rain" },
		{ address: "0xbB171F9fE7619E4bE3B0eCbbFE16F42e20E5d02a", name: "Watch" },
		{ address: "0x59dBd7027d7174E4Ff9FB2f5174e5f6bD4947148", name: "Ken" },
		{ address: "0x54c7bD9CbFb36BEE1Ba5594Fb6d11eE2241a52E4", name: "Nenz" },
		{ address: "0x08e51B860923BEA0AB7d05ae7fe2B8d6bbd42fa8", name: "Aonie" },
		{ address: "0xde632f00c9bdC770D8707e0E97B014E01AdD7406", name: "Oong" },
		{ address: "0x21467932FF15Dc1d4Bec82678d4233795FFbe2Cc", name: "Stamp" },
	];

	const _decimal = 10 ** 18;
	const ethAmount = 1000000;
	const weiAmount = BigInt(ethAmount * _decimal).toString();
	for (const element of addressWallet) {
		try {
			const mint = await deployToken.mint(element.address, weiAmount);
			await mint.wait();
			const balanceOf = await deployToken.balanceOf(element.address);
			console.log("BalanceOf (" + element.name + ") : ", balanceOf / _decimal);
		} catch (e) {
			console.log("Error (" + element.name + ") : ", element.address);
			console.log("Error Message : ", e);
		}
	}

	console.log("address", address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
