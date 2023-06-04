const mongoose = require("mongoose");
const { PictureSchema } = require("./Picture");
const User = mongoose.model("User", {
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  details: { type: [Object] },
  points: { default: 0, type: Number },
  favorites: { type: [] },
  visited: { type: [] },
});

module.exports = User;
