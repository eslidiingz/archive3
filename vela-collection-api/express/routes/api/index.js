const router = require("express").Router();

router.use("/images", require("./image"));
router.use("/users", require("./user"));
router.use("/collections", require("./collection"));
router.use("/assets", require("./asset"));
router.use("/whitelists", require("./whitelist"));
router.use("/register", require("./register"));
router.use("/signin", require("./signin"));
router.use("/signinWithPasscode", require("./signinWithPasscode"));
router.use("/passcodes", require("./passcode"));
router.use("/vipcharacters", require("./vipcharacter"));
router.use("/galleries", require("./gallery"));
router.use("/achievements", require("./achievement"));
router.use("/characterPresets", require("./characterPreset"));
router.use("/validate", require("./checkForName"));

module.exports = router;
