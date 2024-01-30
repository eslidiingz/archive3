const ConfigProduction = {
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
  CLASS_TOKEN_ADDR: "0x5572979305C4525C2AA9A0705798Fb9f164f771B",

  YAAMO_SETTING_ADDR: "0x1Baf9D0967e4E7961D79cF742Fb7a44F7ed9E0b7", // --UPDATE [11-03-65 03:42]
  SUT_SETTING_ADDR: "0x9c3f125F3dA0CeF31Fb091595e8A6c54EFE21e6a", // --UPDATE [11-03-65 03:42]

  LAND_ADDR: "0xEDf64EF78f5e9831FF980Eebcc689C9568f68be5", // --UPDATE [11-03-65 03:42]
  LAND_SUT_ADDR: "0x59ED6D05C9bEFA81bC11aEE8dc029af194Cc8e3A", // --UPDATE [11-03-65 03:42]

  // PHUKET AREA
  OLD_TOWN_SETTING_ADDR: "0x1aDE1fc8aA00FF61645aA5887470B5C817A0D992", // old town
  LAND_OLD_TOWN_ADDR: "0x2ac014d26f2f19f0c4F0F85432F663ab183dd44B", // old town

  // CRESCENT ISLE
  CRESCENT_ISLE_SETTING_ADDR: "0x2d3891842968110BD183E1C67786154206c9df19",
  CRESCENT_ISLE_ADDR: "0x4443573A3B52ea97c8d8fb6Bfc592ee6c1fb30Fb",

  WHITE_LIST: "0xC22276042Cda57315b1E875A4A54C29A4b07Ef1d",
  MARKETPLACE_ADDR: "0xFF10361129E1A211CEd4088DC872A5bc0b6C77Ec",
  OFFER_ADDR: "0xBB0AC558748415C864c5F2F7db71B70C8776BF77",
  GENNFT_ADDR: "0x26BADbA2F9eF28f6C5a99561Aa58B533a6880f53",
  AUCTION_ADDR: "0x14ce9547e2B77A6cbe7FEdCFf33392E6a25B7e8d", // UPDATE [2021-02-26 12:15]
  BID_ADDR: "0x600D2b3a57200f0F974Cd25CdD5cD9E5a905A782", // UPDATE [2021-02-26 12:15]
  BLOCK_EXPLORER: "https://exp.valaverse.io",
  BUNDLE_URI: "https://cdn.velaverse.io/getdata",
  BUNDLE_ASSET_URI: "https://cdn.velaverse.io/zip_upload",
  MINT_ASSET_URI: "https://cdn.velaverse.io/upload_json",
  COLLECTION_API: "https://collection.velaverse.io/api/v1",
  // COLLECTION_API: "http://localhost:3200/api/v1",

  CREATOR_LOGIN_URI:
    "https://velaverse-backend-fzym9.ondigitalocean.app/api/v1/login",
  ADD_VERIFY_BUILDING:
    "https://velaverse-backend-fzym9.ondigitalocean.app/api/v1/creator/request",
  UPDATE_VERIFY_BUILDING:
    "https://velaverse-backend-fzym9.ondigitalocean.app/api/v1/creator/update",
  URLGET_BUILDING:
    "https://velaverse-server-lkwii.ondigitalocean.app/api/v1/get-construction",
  URL_3D: "https://3d.velaverse.io",
  OPEN_PROCESS: true,
  REGISTER_FEE: 5,
  ADMIN_WALLET: "0x8e37A8294e866da31991EE1A097E5049Af3aFA85",
  MINTER_ROLE:
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  GAMESERVER_WS_ENDPOINT: "ws://velaverse-server-lkwii.ondigitalocean.app/",
  GET_ADS_URI:
    "https://velaverse-server-lkwii.ondigitalocean.app/api/v1/get-overlay",
  SET_ADS_URI:
    "https://velaverse-server-lkwii.ondigitalocean.app/api/v1/place-overlay",
  LOGIN_URI: "https://velaverse-server-lkwii.ondigitalocean.app/api/v1/login",
  GET_MAP_URI:
    "https://velaverse-server-lkwii.ondigitalocean.app/api/v1/get-map",
  MSG_HASH: "323SbY2cCPvE9V7WEEtfnXLjCW3dyKZa",
  REST_API: "https://subgraph.velaverse.io",

  // URI ENDPOINT
  FIAT_TRANSACTION_API: "https://apiland.velaverse.io/api/v1/transactions", // GET, POST
  // FIAT_TRANSACTION_API: "http://159.223.53.144:3100/api/v1/transactions", // GET, POST

  GOOGLE_CLIENT_ID:
    "126261282975-d9ttan9kt12c5ai0tgogb1jv4jptbqms.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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",

  FACEBOOK_CLIENT_ID: "964800810862070",
  FACEBOOK_CLIENT_SECRET: "e530562ebc87da53c1921af3e524a52f",
};

export default ConfigProduction;
