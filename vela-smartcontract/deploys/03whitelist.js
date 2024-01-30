const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.getContractFactory("Whitelist");
  const deploy = await contract.deploy(
    "0x61D8B1e912d2AF2328489ba3569d2Baece6Aa77b" // CLASS TEST Vela1 Chain
  );

  await deploy.deployed();

  console.log("Address deployed to:", deploy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
