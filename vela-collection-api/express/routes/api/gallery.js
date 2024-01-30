const router = require("express").Router();
const controllers = require("../../controllers/gallery.controller");

router.get("/", controllers.onGetUploadedImage);
router.get("/uploaded/:filename", controllers.onGetGalleryFile);
router.post("/upload", controllers.onUploadImage);

module.exports = router;
