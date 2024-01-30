const hre = require("hardhat");

async function main() {
  // await hre.run('compile');

  const BUSDToken = await hre.ethers.getContractFactory("BUSDToken");
  const deploy = await BUSDToken.deploy();

  await deploy.deployed();

  console.log("BUSDToken deployed to:", deploy.address);

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
    });
  } catch (error) {
    console.log(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
