const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const config = require("./config/config");

const controller = require("./controllers/transactionController");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(require("./routes"));

app.get(`/api/${config.apiVersion}/transactions`, controller.getTransaction);
app.get(
  `/api/${config.apiVersion}/transactions/all`,
  controller.fetchAllTransaction
);
app.post(
  `/api/${config.apiVersion}/transactions`,
  controller.insertTransaction
);

app.listen(config.port, () => {
  console.log(`Start server at port ${config.port}.`);
});
