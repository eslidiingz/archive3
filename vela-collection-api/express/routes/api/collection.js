const router = require("express").Router();
const controllers = require("../../controllers/collection.controller");
const upload = require("../../utils/image");

router.get("/", controllers.onGetAll);
router.get("/:id", controllers.onGetById);
router.get("/asset/:id", controllers.onFindCollectionByAsset);
router.post("/", upload.single("cover"), controllers.onInsert);
router.put("/:id", controllers.onUpdate);
router.put("/assets/:id", controllers.onUpdateAssets);
router.put("/holder/:id", controllers.onUpdateHolder);
router.put("/transaction/:id", controllers.onUpdateTransaction);
router.delete("/:id", controllers.onDelete);

module.exports = router;
