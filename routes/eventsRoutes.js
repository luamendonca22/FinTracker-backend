const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const checkToken = require("../middleware/auth");

router.post("/events", eventController.create);
router.get("/events", eventController.getAll);
router.get("/events/:id", eventController.getByIndividualId);
router.get("/eventsNear", eventController.getNear);
router.delete("/events", eventController.deleteAll);

module.exports = router;
