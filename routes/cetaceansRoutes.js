const express = require("express");
const router = express.Router();
const cetaceanController = require("../controllers/cetaceanController");
const checkToken = require("../middleware/auth");

router.post("/cetaceans", cetaceanController.create);
router.put("/comments/:id", checkToken, cetaceanController.updateComment);
router.get("/allCetaceans", checkToken, cetaceanController.getAll);
router.get("/cetaceans/:id", checkToken, cetaceanController.getByIndividualId);
router.delete("/cetaceans", cetaceanController.deleteAll);
router.delete("/comments/:cetaceanId/:id", cetaceanController.deleteComment);

module.exports = router;
