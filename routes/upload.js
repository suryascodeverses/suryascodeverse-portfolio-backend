const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  uploadSingle,
  uploadMultiple,
  deleteFile,
} = require('../controllers/uploadController');

router.post('/', protect, upload.single('image'), uploadSingle);
router.post('/multiple', protect, upload.array('images', 10), uploadMultiple);
router.delete('/', protect, deleteFile);

module.exports = router;