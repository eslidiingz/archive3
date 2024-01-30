const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.getContractFactory("Token");
  const deploy = await contract.deploy();

  await deploy.deployed();

  console.log("Token Deploy Address: ", deploy.address);

  // try {
  //   await hre.run("verify:verify", {
  //     address: deploy.address,
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
