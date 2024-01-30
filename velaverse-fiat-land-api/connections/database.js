require("dotenv").config();

const { Pool, Client } = require('pg');

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


module.exports = { pool };