// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat")

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Market = await hre.ethers.getContractFactory("MGNMarketplace")
  const market = await Market.deploy(
    "0x399eb8Da0b9d28C2C159A7b0A58F871a7A3C5485"
  )

  await market.deployed()

  console.log("MGNMarket deployed to:", market.address)
  try {
    await hre.run("verify:verify", {
      address: market.address,
      constructorArguments: ["0x399eb8Da0b9d28C2C159A7b0A58F871a7A3C5485"],
    })
  } catch (e) {}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
