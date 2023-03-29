const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const pictureController = require("../controllers/pictureController");
const checkToken = require("../middleware/auth");

router.post("/picture", upload, checkToken, pictureController.addNew);
router.delete("/picture/:id", checkToken, pictureController.delete);

module.exports = router;
