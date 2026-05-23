const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getDashboardStats, getAnalytics, getWeakAreas } = require('../controllers/dashboardController');

router.get('/stats', auth, getDashboardStats);
router.get('/analytics', auth, getAnalytics);
router.get('/weak-areas', auth, getWeakAreas);

module.exports = router;
