const ConfigLocal = {
  CHAIN_ID: 97,
  RPC: "https://nd-000-791-964.p2pify.com/9d72fc41e88bfa945e49d73b3645fe81",

  /** Contract Address */
  BUSD_CA: "0x1E03067A3CCAB676a5FFaE386a7394Ca1f103bfb", // (IERC20)
  LAND_CA: "0x9DaEB50C1f897590ce435Cdc19EAE544d9D148E8", // Update 28-06-22
  CLAIM_CA: "0xB55EA91f3CE2AFCD062926A52faC6249cA22fbC8", // Update 27-06-22
  MARKET_CA: "0x3327Fd829dF2b9865802F90a1BC5Be7325709012", // Update 27-06-22
  TOKEN_CA: "0x6bDf66E7ce3b1eD70FD1AF000f2a2559F6Ceb477", // Update 27-06-22

  /** ABIs */
  BUSD_ABI: require("../abis/local/BUSDToken.json"),
  LAND_ABI: require("../abis/local/MGNLand.json"),
  CLAIM_ABI: require("../abis/local/MGNClaim.json"),
  MARKET_ABI: require("../abis/local/MGNMarketplace.json"),
  SWAP_ABI: require("../abis/local/MGNSwap.json"),
  TOKEN_ABI: require("../abis/local/MGNToken.json"),

  /** URIs */
  METADATA_URI: "https://testapi.bitmonsternft.com/api/v1/metadata",
  REST_API_URL: "https://testapi.bitmonsternft.com/api/v1",
  INVENTORY_IMG_URL: "https://testapi.bitmonsternft.com/images",
  JSON_RPC: "https://nd-000-791-964.p2pify.com/9d72fc41e88bfa945e49d73b3645fe81",

  HASURA_CONNECTION_URL: "https://staging-gql.siamcannabis.io/v1/graphql",
  HASURA_SECRET_KEY: "2f64590fe77568880f4abafb2c3c4620"
};

export default ConfigLocal;
