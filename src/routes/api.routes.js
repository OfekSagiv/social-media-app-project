const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const groupRoutes = require('./group.routes');
const locationRoutes = require('./location.routes');
const statisticsRoutes = require('./statistics.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/groups', groupRoutes);
router.use('/location', locationRoutes);
router.use('/statistics', statisticsRoutes);

module.exports = router;
