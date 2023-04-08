const mongoose = require("mongoose");
const Cetacean = mongoose.model("Cetacean", {
  /*  taxon_canonical_name: { type: String, required: true },
   details: { type: [Object], required: true },*/
  /* sex: { type: String, required: true }, */
  introduction: { type: String, required: true },
  history: { type: String, required: true },
  migration: { type: String, required: true },
  name: { type: String, required: true },
  socialBehavior: { type: String, required: true },
  physic: { type: String, required: true },
  timestamp_start: { type: Date, required: true },
  timestamp_end: { type: Date, required: true },
  individualId: { type: String, required: true },
  local_identifier: { type: String, required: true },
  details: { type: [Object], required: true },
});

module.exports = Cetacean;
