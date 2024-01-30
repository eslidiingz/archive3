const { utils } = require("ethers");
const hre = require("hardhat");
require("dotenv").config();


async function main() {

 const { MGNCLAIMADDR, MGNTOKENADDR, MGNLANDADDR, MGNMARKETADDR, MGNSWAPADDR, MBUSD }  = process.env;

  try {
        const result = await hre.run("verify:verify", {
        address: MGNLANDADDR,
        constructorArguments: [MBUSD, MGNSWAPADDR],
        });

        console.log(result)
    } catch (e) {console.log(e)}

  }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
