const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics.controller');

router.get('/posts-per-day', statisticsController.getPostsPerDay);
router.get('/users-per-day', statisticsController.getUsersPerDay);

module.exports = router;
