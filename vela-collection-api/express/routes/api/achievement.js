const router = require("express").Router();
const controllers = require("../../controllers/achievement.controller");

router.get("/getFirstTimeLogin", controllers.getFirstTimeLogin);

module.exports = router;
