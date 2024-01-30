const router = require("express").Router();
const controllers = require("../../controllers/image.controller");

router.get("/:id", controllers.onImageById);

module.exports = router;
