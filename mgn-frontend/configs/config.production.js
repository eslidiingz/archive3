const ConfigProduction = {
  CHAIN_ID: 56,
  RPC: "https://bsc-dataseed.binance.org",

  /** Contract Address */
  BUSD_CA: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // (IERC20)
  LAND_CA: "0x0E8478674fa74a89383E91d2d5c072Bc5EA382e4", // Update 28-06-22
  CLAIM_CA: "0x189E911E94ae6A841A169623af3aB4c86b58EB21", // Update 27-06-22
  MARKET_CA: "0xB3aE3905b48420c31b0D5ee1cC533113A979a041", // Update 27-06-22
  TOKEN_CA: "0xB0212A789dAfbafb2f816A6Fcfd5f9402574EC16", // Update 27-06-22

  /** ABIs */
  BUSD_ABI: require("../abis/production/BUSDToken.json"),
  LAND_ABI: require("../abis/production/MGNLand.json"),
  CLAIM_ABI: require("../abis/production/MGNClaim.json"),
  MARKET_ABI: require("../abis/production/MGNMarketplace.json"),
  SWAP_ABI: require("../abis/production/MGNSwap.json"),
  TOKEN_ABI: require("../abis/production/MGNToken.json"),

  /** URIs */
  METADATA_URI: "https://testapi.bitmonsternft.com/api/v1/metadata",
  REST_API_URL: "https://testapi.bitmonsternft.com/api/v1",
  INVENTORY_IMG_URL: "https://testapi.bitmonsternft.com/images",
  JSON_RPC: "https://bsc-dataseed.binance.org",

  HASURA_CONNECTION_URL: "https://gql.siamcannabis.io/v1/graphql",
  HASURA_SECRET_KEY: "2f64590fe77568880f4abafb2c3c4620"
};

export default ConfigProduction;
