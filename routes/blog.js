const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostsByTag,
} = require('../controllers/blogController');

// Validation middleware
const blogValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('excerpt')
    .trim()
    .notEmpty()
    .withMessage('Excerpt is required')
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

// Public routes
router.get('/', getBlogPosts);
router.get('/tag/:tag', getBlogPostsByTag);
router.get('/:slug', getBlogPostBySlug);

// Protected routes
router.post('/', protect, blogValidation, createBlogPost);
router.put('/:slug', protect, blogValidation, updateBlogPost);
router.delete('/:slug', protect, deleteBlogPost);

module.exports = router;