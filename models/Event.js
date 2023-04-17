const mongoose = require("mongoose");
const Event = mongoose.model("Event", {
  timestamp: { type: Date, required: true },
  location_lat: { type: String, required: true },
  location_long: { type: String, required: true },
  individualId: { type: String, required: true },
  tag_id: { type: String, required: true },
});

module.exports = Event;
