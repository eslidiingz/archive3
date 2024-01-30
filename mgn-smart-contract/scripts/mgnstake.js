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
  const MGNStake = await hre.ethers.getContractFactory("MGNStake")
  const stake = await MGNStake.deploy(
    "0x5416Be10de73C6631EDAB65163e8b814b7185785",
    "0xffcE4205Bfac7029D8950671639BBF8a7C705198"
  )

  await stake.deployed()

  console.log("Greeter deployed to:", stake.address)
  try {
    await hre.run("verify:verify", {
      address: stake.address,
      constructorArguments: [
        "0x5416Be10de73C6631EDAB65163e8b814b7185785",
        "0xffcE4205Bfac7029D8950671639BBF8a7C705198",
      ],
    })
  } catch (e) {}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
