const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['page_view', 'blog_view', 'project_view'],
    required: true,
  },
  resourceId: {
    type: String,
    required: true,
  },
  resourceTitle: String,
  userAgent: String,
  ip: String,
  country: String,
  referer: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

analyticsSchema.index({ type: 1, timestamp: -1 });
analyticsSchema.index({ resourceId: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);