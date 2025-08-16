const statisticsService = require('../services/statistics.service');

exports.renderStatisticsPage = (req, res) => {
  const user = req.user || req.session.user || null;
  res.render('statistics', { user });
};

exports.getPostsPerDay = async (req, res) => {
  try {
    const data = await statisticsService.getPostsPerDay();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post stats' });
  }
};

exports.getUsersPerDay = async (req, res) => {
  try {
    const data = await statisticsService.getUsersPerDay();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};
