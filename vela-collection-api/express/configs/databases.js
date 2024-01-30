const mongoose = require("mongoose");
const mysql = require("mysql2");
const config = require("../configs/app");

const databases = {
  mongoDB() {
    mongoose.set("debug", true);
    const db = mongoose.connect(
      config.mongodbUri,
      {
        authSource: "admin",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      (error) => {
        if (error) console.error("MongoDB error: ", error);
        console.log("MongoDB connected");
      }
    );
    return db;
  },

  mysql() {
    const connection = mysql.createPool({
      connectionLimit: 10,
      host: config.hostname,
      user: config.username,
      password: config.password,
      database: config.database,
      port: config.dbPort,
      charset: "utf8",
    });

    return connection;
  },

  postgresql() {},

  mssql() {},
};

module.exports = databases;
