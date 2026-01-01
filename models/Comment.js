const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blogPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      maxlength: 2000,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ blogPostId: 1, approved: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
