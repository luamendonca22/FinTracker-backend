const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/auth");

router.get("/user/:id", checkToken, userController.getUser);
router.put("/user/:id/details", userController.updateDetails);
router.put("/user/:id/points", userController.updatePoints);
router.put("/user/:id/password", userController.updatePassword);
router.get("/user/:id/details", userController.getDetails);
router.delete("/user/:id/delete", userController.deleteUser);
module.exports = router;
