const router = require("express").Router();
const controllers = require("../../controllers/register.controller");

router.post("/", controllers.onRegister);

module.exports = router;
