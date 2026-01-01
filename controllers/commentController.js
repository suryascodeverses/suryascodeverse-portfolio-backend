const Comment = require("../models/Comment");

// Get comments for a blog post
exports.getComments = async (req, res, next) => {
  try {
    const { blogPostId } = req.params;
    const query = req.user ? { blogPostId } : { blogPostId, approved: true };

    const comments = await Comment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// Create comment
exports.createComment = async (req, res, next) => {
  try {
    const { blogPostId } = req.params;
    const { name, email, content, parentId } = req.body;

    const comment = await Comment.create({
      blogPostId,
      name,
      email,
      content,
      parentId,
    });

    res.status(201).json({
      success: true,
      message: "Comment submitted for approval",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Approve comment (admin only)
exports.approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment (admin only)
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments (admin only)
exports.getAllComments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query =
      status === "pending"
        ? { approved: false }
        : status === "approved"
        ? { approved: true }
        : {};

    const comments = await Comment.find(query)
      .populate("blogPostId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};
