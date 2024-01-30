const { utils } = require("ethers");
const hre = require("hardhat");

async function main() {

  let MGNCLAIMADDR, MGNTOKENADDR, MGNLANDADDR, MGNMARKETADDR, MGNSWAPADDR;


  const MBUSD = "0xF461422d96708fbC8847A78a72eD77B748a740De";
  const _globalWallet = "0x6B60BEfe688834AB5CA33b43FA5130B960117C43";


  // from MGNClaim & Land
  const MARKET_ROLE = utils.id("MARKET_ROLE");
  const SETTER_ROLE = utils.id("SETTER_ROLE");
  //from MGNLand
  const BURNER_ROLE = utils.id("BURNER_ROLE");
  const MINTER_ROLE = utils.id("MINTER_ROLE");

  //from Market
  const CLAIMER_ROLE = utils.id("CLAIMER_ROLE");

  // deploy MGNToken
  const mgnTokenContract = await hre.ethers.getContractFactory("MGNToken");
  const mgnToken = await mgnTokenContract.deploy();
  await mgnToken.deployed();

  MGNTOKENADDR = mgnToken.address;

  // deploy MGNSwap
  const mgnSwapContract = await hre.ethers.getContractFactory("MGNSwap");
  const mgnSwap = await mgnSwapContract.deploy(_globalWallet, MGNTOKENADDR);
  await mgnSwap.deployed();

  MGNSWAPADDR = mgnSwap.address;

  // deploy MGNland
  const mgnLanContract = await hre.ethers.getContractFactory("MgnLand");
  const mgnLand = await mgnLanContract.deploy(MBUSD, MGNSWAPADDR);
  await mgnLand.deployed();

  MGNLANDADDR = mgnLand.address;

  // deploy MGNClaim
  const mgnClaimContract = await hre.ethers.getContractFactory("MGNClaim");
  const mgnClaim = await mgnClaimContract.deploy(MGNLANDADDR, MGNTOKENADDR);
  await mgnClaim.deployed();

  MGNCLAIMADDR = mgnClaim.address;

  // deploy MGNMarket
  const mgnMarketContract = await hre.ethers.getContractFactory("MGNMarketplace");
  const mgnMarket = await mgnMarketContract.deploy(_globalWallet);
  await mgnMarket.deployed();

  MGNMARKETADDR = mgnMarket.address;

  const landGrantRoleToMarket = await mgnLand.grantRole(MARKET_ROLE, MGNMARKETADDR);
  const landGrantBurnToClaim = await mgnLand.grantRole(BURNER_ROLE, MGNCLAIMADDR);
  const landGrantMinterToClaim = await mgnToken.grantRole(MINTER_ROLE, MGNCLAIMADDR);


  let contracts = [MGNCLAIMADDR, MGNTOKENADDR, MGNLANDADDR, MGNMARKETADDR, MGNSWAPADDR];

  for (const contract of contracts) {
    console.log("Contracts has been deployed to " + contract);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
