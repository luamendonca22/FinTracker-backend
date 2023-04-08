const express = require("express");
const router = express.Router();
const cetaceanController = require("../controllers/cetaceanController");
const checkToken = require("../middleware/auth");

router.post("/cetaceans", checkToken, cetaceanController.create);
router.get("/cetaceans", checkToken, cetaceanController.getAll);
router.delete("/cetaceans", checkToken, cetaceanController.deleteAll);

module.exports = router;
