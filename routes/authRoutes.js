const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/auth");

router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.delete("/auth/:id/remove", checkToken, userController.deleteAccount);

module.exports = router;
