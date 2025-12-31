const { uploadImage, deleteImage } = require('../utils/uploadManager');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
exports.uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file',
      });
    }

    const result = await uploadImage(req.file);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload files',
      });
    }

    const uploadPromises = req.files.map((file) => uploadImage(file));
    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image
// @route   DELETE /api/upload
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const { publicId, key, path } = req.body;

    await deleteImage({ publicId, key, path });

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};