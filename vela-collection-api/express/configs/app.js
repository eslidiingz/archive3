require("dotenv").config();

module.exports = {
  appUrl: process.env.APP_URL ? `${process.env.APP_URL}:${process.env.PORT || 3000}` : "http://localhost:3000",
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === "production",
  apiVersion: process.env.API_VERSION || 1,
  token_exp_days: process.env.TOKEN_EXP_DAYS || 1,
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "my-secret",
  mongodbUri: process.env.MONGODB_URI,
  pageLimit: process.env.PAGE_LIMIT || 1000,
  signinSecret: process.env.SIGNIN_SECRET || "my-signin-secret",

  hostname: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
