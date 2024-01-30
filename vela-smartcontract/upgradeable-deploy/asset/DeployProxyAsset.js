const { ethers, upgrades } = require("hardhat");

async function main() {
  const VelaverseAssetV1 = await ethers.getContractFactory("VelaverseAssetV1");
  const asset = await upgrades.deployProxy(VelaverseAssetV1, [], {
    initializer: "initialize",
  });

  await asset.deployed();
  console.log(asset.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
