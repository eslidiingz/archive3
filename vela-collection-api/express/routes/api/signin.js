const router = require("express").Router();
const controllers = require("../../controllers/signin.controller");

router.post("/", controllers.onSignInWithCredential);

module.exports = router;
