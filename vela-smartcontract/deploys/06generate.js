const hre = require("hardhat");

async function main() {
  const VelaverseAsset = await hre.ethers.getContractFactory("VelaverseAsset");
  const smartContract = await VelaverseAsset.deploy();

  await smartContract.deployed();

  console.log("VelaverseAsset deployed to:", smartContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
