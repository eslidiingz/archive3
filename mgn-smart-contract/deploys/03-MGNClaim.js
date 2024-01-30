const hre = require("hardhat");

async function main() {
  // const tokenAddress = "0xF461422d96708fbC8847A78a72eD77B748a740De";
  const _landAddress = "0x2510adB028849BC8765EA79baadb5A191899c47C";
  const _mgnAddress = "0xd922Eabf8A398E022782Bf3c39cdC20e7933bC08";

  const contract = await hre.ethers.getContractFactory("MGNStake");
  const deploy = await contract.deploy(_landAddress, _mgnAddress);
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
