require("dotenv").config();

const config = {
  port: process.env.PORT,
  apiVersion: process.env.API_VERSION,
};

module.exports = { ...config };
