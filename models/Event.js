const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  individualId: { type: String, required: true },
});

// Add index to location field
EventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", EventSchema);
Event.createIndexes();
module.exports = Event;
