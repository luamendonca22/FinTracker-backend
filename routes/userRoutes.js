const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/auth");

router.get("/user/:id", checkToken, userController.getUser);
router.put("/user/:id/details", checkToken, userController.updateDetails);
router.put("/user/:id/points", checkToken, userController.updatePoints);
router.put("/user/:id/password", checkToken, userController.updatePassword);
router.put("/user/:id/username", checkToken, userController.updateUsername);
router.get("/user/:id/details", userController.getDetails);
module.exports = router;
