// const Token = await ethers.getContractFactory("Token")
// const token = await Token.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")
const hre = require("hardhat");
const address = "0xAaD80A77768C1D6D1ed542be3344865407e412D5";
async function main() {
  const contract = await hre.ethers.getContractFactory("Land");
  const deploy = await contract.attach(address);
  //   await deploy.migrateLands(
  //     "0x782beb424b3b39a73f48738c19cae82ff9f17549",
  //     [99, 99],
  //     [0, 1]
  //   );
  //   console.log("deploy", deploy);
  const getData = await deploy.getLands();
  console.log("getData", getData);

  const supply = await deploy.prevSupply();
  console.log("supply", supply);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
