require("dotenv").config();
const withImages = require("next-images");

module.exports = withImages({
  async redirects() {
    return [
      {
        source: "/",
        destination: "/map",
        permanent: true,
      },
    ];
  },

  reactStrictMode: false,
  trailingSlash: true,
  env: {
    MORALIS_SERVER_URL: process.env.MORALIS_SERVER_URL,
    MORALIS_APP_ID: process.env.MORALIS_APP_ID,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
  },
});
