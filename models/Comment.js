const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = { Comment, CommentSchema };
