const BlogPost = require('../models/BlogPost');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public (only published) / Private (all posts)
exports.getBlogPosts = async (req, res, next) => {
  try {
    let query = {};
    
    // If not authenticated, only show published posts
    if (!req.user) {
      query.published = true;
    }

    const posts = await BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public (if published) / Private (any post)
exports.getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    // If not authenticated and post is not published, deny access
    if (!req.user && !post.published) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    // Increment view count (only for published posts)
    if (post.published) {
      post.views += 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
exports.createBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:slug
// @access  Private
exports.updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:slug
// @access  Private
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog posts by tag
// @route   GET /api/blog/tag/:tag
// @access  Public
exports.getBlogPostsByTag = async (req, res, next) => {
  try {
    const posts = await BlogPost.find({
      tags: req.params.tag,
      published: true,
    }).sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};