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
  const MGNLand = await hre.ethers.getContractFactory("MGNLAND")
  const land = await MGNLand.deploy(
    "0x8A5690ddd396F2D0B999a00932D770cCB9C0A659",
    "0xc735705201bB8F11f2A0754D04f7D2712eF3B4FA"
  )

  await land.deployed()

  console.log("MGNLand deployed to:", land.address)
  try {
    await hre.run("verify:verify", {
      address: land.address,
      constructorArguments: [
        "0x8A5690ddd396F2D0B999a00932D770cCB9C0A659",
        "0xc735705201bB8F11f2A0754D04f7D2712eF3B4FA",
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
