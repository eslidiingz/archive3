const router = require("express").Router();
const controllers = require("../../controllers/transactionController");

router.get("/transactions", controllers.getTransaction);
router.post("/transactions", controllers.insertTransaction);

module.exports = router;
