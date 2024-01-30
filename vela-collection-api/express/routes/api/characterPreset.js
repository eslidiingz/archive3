const router = require("express").Router();
const controllers = require("../../controllers/characterPreset.controller");

router.get("/", controllers.onGetCharacterPresetByUser);

module.exports = router;
