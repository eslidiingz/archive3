const router = require("express").Router();
const controllers = require("../../controllers/vipcharacter.controller");

router.get("/", controllers.onGetVipCharacterByPasscode);
router.post("/", controllers.onInsert);
router.patch("/clearModelPrefabAndNickname", controllers.onClearModelPrefabAndNickname);
router.delete("/deleteAll", controllers.onDeleteAll);

module.exports = router;
