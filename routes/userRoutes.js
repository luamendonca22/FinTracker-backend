const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/auth");
const upload = require("../config/multer");

router.get("/user/:id", checkToken, userController.getUser);
router.put("/user/:id/details", checkToken, userController.updateDetails);
router.put("/user/:id/points", checkToken, userController.updatePoints);
router.put("/user/:id/password", checkToken, userController.updatePassword);
router.post("/user/forgotPassword", userController.forgotPassword);
router.get("/user/:id/resetPassword/:token", userController.showResetPassword);
router.post("/user/:id/resetPassword/:token", userController.resetPassword);
router.put("/user/:id/username", checkToken, userController.updateUsername);
router.get("/user/:id/details", checkToken, userController.getDetails);
router.get("/users", checkToken, userController.getAllUsers);
router.put("/user/:id/picture", checkToken, upload, userController.addPicture);
router.get("/:id/uploads", checkToken, userController.getPicture);
router.delete("/user/:id/picture", checkToken, userController.deletePicture);
module.exports = router;
