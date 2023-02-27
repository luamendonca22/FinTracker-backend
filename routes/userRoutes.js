const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/auth");

router.get("/user/:id", checkToken, userController.getUser);

module.exports = router;
