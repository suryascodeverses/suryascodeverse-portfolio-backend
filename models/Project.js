const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Please provide a project category"],
      enum: {
        values: [
          "Web App",
          "Mobile App",
          "API",
          "Desktop App",
          "Game",
          "Other",
        ],
        message:
          "Category must be one of: Web App, Mobile App, API, Desktop App, Game, Other",
      },
      default: "Web App",
    },
    image: {
      type: String,
      required: [true, "Please provide a project image URL"],
    },
    technologies: {
      type: [String],
      required: [true, "Please provide at least one technology"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one technology is required",
      },
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
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
projectSchema.index({ featured: 1, createdAt: -1 });
projectSchema.index({ order: 1 });

module.exports = mongoose.model("Project", projectSchema);
