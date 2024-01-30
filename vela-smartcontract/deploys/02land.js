const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x507E900545b3242FC30aFa9b0A633F4D52d74234";

  const contract = await hre.ethers.getContractFactory("Land");
  const deploy = await contract.deploy(tokenAddress);
  await deploy.deployed();

  console.log("Land deployed to:", deploy.address);

  // try {
  //   await hre.run("verify:verify", {
  //     address: deploy.address,
  //     constructorArguments: [tokenAddress],
  //   });
  // } catch (e) {}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
