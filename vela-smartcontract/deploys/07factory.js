const hre = require("hardhat");

async function main() {
	const contract = await hre.ethers.getContractFactory("Factory");
	const token_address = "0x3a8E8f07036205a492624F6E880bbC1a0ade4833";
	const land_address = "0xB8dCF17aB381ee8671CdAF9398488B30d84958A1";
	const deploy = await contract.deploy(token_address, land_address);

	await deploy.deployed();

	console.log("Address deployed to:", deploy.address);

	const land_contract = await ethers.getContractAt("Land", land_address);
	await land_contract.grantRole(
		"0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", // MINTER_ROLE
		deploy.address
	);

	try {
		await hre.run("verify:verify", {
			address: deploy.address,
			constructorArguments: [token_address, land_address],
		});
	} catch (e) {}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
