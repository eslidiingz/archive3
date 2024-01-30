require("dotenv").config();

const Config = require("./utils/config.json");

module.exports = {
  reactStrictMode: true,
  trailingSlash: false,
  env: {
    MORALIS_SERVER_URL: process.env.MORALIS_SERVER_URL,
    MORALIS_APP_ID: process.env.MORALIS_APP_ID,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    CLASS_TOKEN_ADDR: process.env.CLASS_TOKEN_ADDR,
    LAND_ADDR: process.env.LAND_ADDR,
    GENNFT_ARRD: process.env.GENNFT_ARRD,
    FACTORY_ADDR: process.env.FACTORY_ADDR,
  },
};
