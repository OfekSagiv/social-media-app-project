const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');
const { isLoggedIn } = require('../middleware/auth');

router.get('/posts-per-day', isLoggedIn, statisticsController.getPostsPerDay);
router.get('/users-per-day', isLoggedIn, statisticsController.getUsersPerDay);

module.exports = router;
