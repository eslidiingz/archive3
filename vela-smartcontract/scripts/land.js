const hre = require("hardhat");

async function main() {
  const Land = await hre.ethers.getContractFactory("Land");
  const land = await Land.deploy("0x61D8B1e912d2AF2328489ba3569d2Baece6Aa77b");

  await land.deployed();

  console.log("Land deployed to:", land.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
