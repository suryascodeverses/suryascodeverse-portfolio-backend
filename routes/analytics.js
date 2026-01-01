const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { trackEvent, getDashboardStats } = require('../controllers/analyticsController');

router.post('/track', trackEvent);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;