const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const {
  getComments,
  createComment,
  approveComment,
  deleteComment,
  getAllComments,
} = require("../controllers/commentController");

const commentValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ max: 2000 }),
];

router.get("/post/:blogPostId", getComments);
router.post("/post/:blogPostId", commentValidation, createComment);
router.get("/admin", protect, getAllComments);
router.put("/:id/approve", protect, approveComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;
