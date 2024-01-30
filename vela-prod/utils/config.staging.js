const ConfigStaging = {
  CHAIN_ID: 555,
  JSON_RPC: "https://rpc.velaverse.io",
  CHAIN_MORALIS: "",
  WHITELIST: [
    "0xeC7F9D4d6f00157314d423becA6156Df38CF336f",
    "0x017468d3E8069fF58668ee3207D1A94eB1E7aeB3",
    "0x5572979305C4525C2AA9A0705798Fb9f164f771B",
  ],
  WHITELIST_ABI: [
    "utils/abis/production/land.json",
    "utils/abis/production/mint.json",
    "utils/abis/production/token.json",
  ],
  LAND_COLLECTION: "61f502ca662617aed7679a72",
  APP_ID: "",
  SERVER_URL: "",
  CLASS_TOKEN_ADDR: "0x9C4469B24bC55E1E42AF0BB645D6e53ECc4e50dC",
  YAAMO_SETTING_ADDR: "0xa5426dcbFFC7A429F6716417FAD66A60B684572A",
  SUT_SETTING_ADDR: "0xa5426dcbFFC7A429F6716417FAD66A60B684572A",
  OLD_TOWN_SETTING_ADDR: "0xD6248925A8521d25a6d5A127f0D1E949b33C2FC5", // old town

  LAND_ADDR: "0x2B9880CfB27AF90707Fd6f80457B235C77a45d8e", // Yaamo
  LAND_SUT_ADDR: "0x4Ba865cE387867c1ef63a7C929Ce85D86062d379",
  LAND_OLD_TOWN_ADDR: "0x793552Ce098bB545bFE69cC9c4206Ac1FdA21059", // old town

  WHITE_LIST: "0x23Cca701043E2D71DEc7280e068C07eDc4EAB6A5",
  MARKETPLACE_ADDR: "0xCde9cF4002CF50066020375AfB39CD71b98683AC",
  OFFER_ADDR: "0x7471Eb54785B1fD5c7E44b9f2C2bDff91dB0Db99",
  GENNFT_ADDR: "0x00e75Dac4e585d5A5aDf98b8277849EC7F3fd658",
  AUCTION_ADDR: "0xA890773a32ae502B71443eD3c6ddA5a27f3F6d14",
  BID_ADDR: "0x502913B96CF47dfb1881Ad5e1822D9943D882f70",
  BLOCK_EXPLORER: "https://exp.velaverse.io",
  BUNDLE_URI: "https://cdn.velaverse.io/getdata",
  BUNDLE_ASSET_URI: "https://cdn.velaverse.io/zip_upload",
  MINT_ASSET_URI: "https://cdn.velaverse.io/upload_json",
  // COLLECTION_API: "http://localhost:3200/api/v1",
  COLLECTION_API: "https://collection-vela.multiverse2021.io/api/v1",
  CREATOR_LOGIN_URI:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/login",
  ADD_VERIFY_BUILDING:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/creator/request",
  UPDATE_VERIFY_BUILDING:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/creator/update",
  URLGET_BUILDING:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/get-construction",
  URL_3D: "https://3d.velaverse.io",
  OPEN_PROCESS: true,
  REGISTER_FEE: 5,
  ADMIN_WALLET: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
  MINTER_ROLE:
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  GAMESERVER_WS_ENDPOINT:
    "ws://dev-velaverse-websocket-67kmj.ondigitalocean.app/",
  GET_ADS_URI:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/get-overlay",
  SET_ADS_URI:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/place-overlay",
  LOGIN_URI:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/login",
  GET_MAP_URI:
    "https://dev-velaverse-websocket-67kmj.ondigitalocean.app/api/v1/get-map",
  MSG_HASH: "323SbY2cCPvE9V7WEEtfnXLjCW3dyKZa",
  REST_API: "https://subgraph.velaverse.io",

  FIAT_TRANSACTION_API: "http://159.223.53.144:3100/api/v1/transactions", // GET, POST
  // FIAT_TRANSACTION_API: "http://localhost:3300/api/v1/transactions", // local

  GOOGLE_CLIENT_ID: "126261282975-d9ttan9kt12c5ai0tgogb1jv4jptbqms.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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",

  FACEBOOK_CLIENT_ID: "964800810862070",
  FACEBOOK_CLIENT_SECRET: "e530562ebc87da53c1921af3e524a52f"
};

export default ConfigStaging;
