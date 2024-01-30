const hre = require("hardhat");

async function main() {
  const GenerateAccessControl = await hre.ethers.getContractFactory(
    "GenerateAccessControl"
  );
  const smartContract = await GenerateAccessControl.deploy();

  await smartContract.deployed();

  console.log("GenerateAccessControl deployed to:", smartContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
