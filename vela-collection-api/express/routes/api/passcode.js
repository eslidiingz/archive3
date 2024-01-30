const router = require("express").Router();
const controllers = require("../../controllers/passcode.controller");

router.post("/", controllers.onGetByPasscode);

module.exports = router;
