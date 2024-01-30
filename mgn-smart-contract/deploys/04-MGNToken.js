const hre = require("hardhat");

async function main() {
  // await hre.run('compile');

   // deploy MGNToken
   const mgnTokenContract = await hre.ethers.getContractFactory("MGNToken");
   const mgnToken = await mgnTokenContract.deploy();
   await mgnToken.deployed();
   await mgnToken.wait(5);
 
   mgnTokenAddr = mgnToken.address;

  console.log("MGNToken deployed to:", mgnTokenAddr);

  try {
    await hre.run("verify:verify", {
      address: mgnTokenAddr,
    });
  } catch (error) {
    console.log(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
