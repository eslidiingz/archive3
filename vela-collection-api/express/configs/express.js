const express = require("express"),
  morgan = require("morgan"),
  cors = require("cors"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  path = require("path");

module.exports = async (app) => {
  // Connect MongoDB
  const databases = require("../configs/databases");

  databases.mongoDB();
  // databases.mysql();

  // CORS
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3100",
    "http://localhost:3200",
    "http://localhost:3300",
    "http://localhost:3700",
    "https://market.velaverse.io",
    "https://testnet-vela.multiverse2021.io",
    "https://admin.velaverse.io",
    "https://demo2.velaverse.io",
    "https://multiplay.velaverse.io",
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not " + "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  };
  app.use(cors(corsOptions));

  // Parser Body
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // app.use(express.static("public"));

  // Logger
  app.use(morgan("dev"));

  // Passport
  require("../configs/passport");

  // Static file
  app.use("/static", express.static(path.join(__dirname, "../public")));

  // Custom Response Format
  app.use(require("../configs/responseFormat"));
};
