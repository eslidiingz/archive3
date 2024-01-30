const router = require("express").Router();
const controllers = require("../../controllers/asset.controller");

router.get("/", controllers.onGetAll);
router.get("/:address/:token", controllers.onGetByAddressToken);
router.put("/:address/:token/visible", controllers.onUpdateVisible);
router.get("/:id", controllers.onGetById);
router.put("/:id", controllers.onUpdate);
router.post("/", controllers.onInsert);
router.delete("/:id", controllers.onDelete);

module.exports = router;
