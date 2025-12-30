const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// Validation middleware
const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
];

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, projectValidation, createProject);
router.put('/:id', protect, projectValidation, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;