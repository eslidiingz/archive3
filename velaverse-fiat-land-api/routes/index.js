const router = require("express").Router();
const config = require("../config/config");

router.use(`/api/${config.apiVersion}/`, require("./api"));

module.exports = router;
