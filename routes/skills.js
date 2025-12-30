const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');

// Validation middleware
const skillValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 50 })
    .withMessage('Skill name cannot exceed 50 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Frontend', 'Backend', 'DevOps', 'Other'])
    .withMessage('Invalid category'),
  body('proficiency')
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be between 0 and 100'),
];

// Public routes
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes
router.post('/', protect, skillValidation, createSkill);
router.put('/:id', protect, skillValidation, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;