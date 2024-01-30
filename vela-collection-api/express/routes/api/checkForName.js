const router = require("express").Router();
const controllers = require("../../controllers/checkForName.controller");

router.get("/checkForName", controllers.checkForName);

module.exports = router;