const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  src: { type: String, required: true },
  userId: { type: String },
});
const Picture = mongoose.model("Picture", PictureSchema);
module.exports = { Picture, PictureSchema };
