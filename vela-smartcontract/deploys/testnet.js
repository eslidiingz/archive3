const hre = require("hardhat");

async function main() {
	let address = {};

	//fixed token
	address.token = "0xAd087013F715FF956e3fA0ea7022E39Dec891D6e"; // class coin bsc

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

	// Generate
	const contractGenerate = await hre.ethers.getContractFactory("Generate");
	const deployGenerate = await contractGenerate.deploy();
	await deployGenerate.deployed();
	address.generate = deployGenerate.address;
	try {
		await hre.run("verify:verify", { address: address.generate });
	} catch (e) {}

	console.log("address", address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
