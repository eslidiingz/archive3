const router = require("express").Router();
const controllers = require("../../controllers/signinWithPasscode");

router.post("/", controllers.onSignInByPasscode);

module.exports = router;
