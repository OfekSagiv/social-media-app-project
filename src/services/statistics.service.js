const Post = require('../models/Post');
const User = require('../models/User');

exports.getPostsPerDay = async () => {
  const result = await Post.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  return result.map(r => ({ date: r._id, count: r.count }));
};

exports.getUsersPerDay = async () => {
  const result = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  return result.map(r => ({ date: r._id, count: r.count }));
};
