const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide blog content'],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically set publishedAt when published changes to true
blogPostSchema.pre('save', function (next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for faster queries
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ published: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);