const hre = require("hardhat")

async function main() {
  const CNBEcommerce = await hre.ethers.getContractFactory("CNBEcommerce")
  const tokenAddress = "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb"
  const feeRate = 300

  const deploy = await CNBEcommerce.deploy(tokenAddress, feeRate)

  await deploy.deployed()

  console.log("CNBEcommerce deployed to:", deploy.address)

  try {
    await hre.run("verify:verify", {
      address: deploy.address,
      contract: "contracts/CNBEcommerce.sol:CNBEcommerce",
      constructorArguments: [tokenAddress, feeRate],
    })
  } catch (error) {
    console.log(error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
