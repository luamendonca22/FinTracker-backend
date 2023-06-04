const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkToken = require("../middleware/auth");
const upload = require("../config/multer");

router.post("/user/forgotPassword", userController.forgotPassword);
router.post("/user/:id/resetPassword/:token", userController.resetPassword);

router.get("/user/:id", checkToken, userController.getUser);
router.get("/user/:id/resetPassword/:token", userController.showResetPassword);
router.get("/user/:id/details", checkToken, userController.getDetails);
router.get("/users", checkToken, userController.getAllUsers);
router.get("/:id/uploads", checkToken, userController.getPicture);

router.put("/user/:id/details", checkToken, userController.updateDetails);
router.put("/user/:id/points", checkToken, userController.updatePoints);
router.put("/user/:id/password", checkToken, userController.updatePassword);
router.put("/user/:id/username", checkToken, userController.updateUsername);
router.put(
  "/user/:id/picture",
  checkToken,
  upload,
  userController.updatePicture
);
router.put("/user/:id/favorites", checkToken, userController.updateFavorites);
router.put("/user/:id/visited", checkToken, userController.updateVisited);
router.put(
  "/user/:id/favorites/remove",
  checkToken,
  userController.deleteFavorite
);

router.delete("/user/:id/picture", checkToken, userController.deletePicture);

module.exports = router;
