const hre = require("hardhat");

async function main() {
  let address = {};

  //fixed token
  address.token = "0x22F4bbA864363c7b35d665932a03fb3eD1a4d48A"; // class coin bsc

  // Land
  const contractLand = await hre.ethers.getContractFactory("Land");
  const deployLand = await contractLand.deploy(address.token);
  await deployLand.deployed();
  address.land = deployLand.address;

  // Whitelist
  const contractWhitelist = await hre.ethers.getContractFactory("Whitelist");
  const deployWhitelist = await contractWhitelist.deploy(address.token);
  await deployWhitelist.deployed();
  address.whitelist = deployWhitelist.address;

  // Marketplace
  const contractMarketplace = await hre.ethers.getContractFactory(
    "Marketplace"
  );
  const deployMarketplace = await contractMarketplace.deploy(address.whitelist);
  await deployMarketplace.deployed();
  address.marketplace = deployMarketplace.address;

  // Generate
  const contractGenerate = await hre.ethers.getContractFactory("Generate");
  const deployGenerate = await contractGenerate.deploy();
  await deployGenerate.deployed();
  address.generate = deployGenerate.address;

  console.log("address", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
