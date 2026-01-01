const Analytics = require('../models/Analytics');
const BlogPost = require('../models/BlogPost');
const Project = require('../models/Project');

// Track event
exports.trackEvent = async (req, res, next) => {
  try {
    const { type, resourceId, resourceTitle } = req.body;
    
    await Analytics.create({
      type,
      resourceId,
      resourceTitle,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      referer: req.headers.referer,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalViews,
      recentViews,
      blogViews,
      projectViews,
      topBlogPosts,
      topProjects,
      viewsByDay,
    ] = await Promise.all([
      Analytics.countDocuments(),
      Analytics.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      Analytics.countDocuments({ type: 'blog_view' }),
      Analytics.countDocuments({ type: 'project_view' }),
      Analytics.aggregate([
        { $match: { type: 'blog_view' } },
        { $group: { _id: '$resourceId', count: { $sum: 1 }, title: { $first: '$resourceTitle' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Analytics.aggregate([
        { $match: { type: 'project_view' } },
        { $group: { _id: '$resourceId', count: { $sum: 1 }, title: { $first: '$resourceTitle' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Analytics.aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        recentViews,
        blogViews,
        projectViews,
        topBlogPosts,
        topProjects,
        viewsByDay,
      },
    });
  } catch (error) {
    next(error);
  }
};