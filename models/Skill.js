const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      trim: true,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a skill category'],
      enum: {
        values: ['Frontend', 'Backend', 'DevOps', 'Other'],
        message: 'Category must be Frontend, Backend, DevOps, or Other',
      },
    },
    proficiency: {
      type: Number,
      required: [true, 'Please provide a proficiency level'],
      min: [0, 'Proficiency cannot be less than 0'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 50,
    },
    icon: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ order: 1 });

module.exports = mongoose.model('Skill', skillSchema);