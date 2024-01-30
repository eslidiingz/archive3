const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.getContractFactory("Auction");
  const deploy = await contract.deploy(
    "0xE6d83656Ce29872DcABDDAFDa81c23f6637c443d"
  );

  await deploy.deployed();

  console.log("Address deployed to:", deploy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
