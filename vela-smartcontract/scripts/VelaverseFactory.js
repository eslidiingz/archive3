const hre = require("hardhat");

async function main() {
  const VelaverseFactory = await hre.ethers.getContractFactory(
    "VelaverseFactory"
  );
  const deployVevaverseFactory = await VelaverseFactory.deploy(
    "VELAVERSE FACTORY",
    "VFAC",
    "https://multiverseexpert.io"
  );

  const deployed = await deployVevaverseFactory.deployed();
  console.log(`Contract Address: ${deployed.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
