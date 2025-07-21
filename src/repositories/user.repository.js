const User = require('../models/User');

const createUser = async (userData) => {
    return await User.create(userData);
};

const findAllUsers = async ({ fullName, bio, dobFrom, dobTo } = {}) => {
  const query = {};

  if (fullName) {
    query.fullName = { $regex: fullName, $options: 'i' };
  }

  if (bio) {
    query.bio = { $regex: bio, $options: 'i' };
  }

  if (dobFrom || dobTo) {
    query.dateOfBirth = {};
    if (dobFrom) {
      const from = new Date(dobFrom);
      if (!isNaN(from)) query.dateOfBirth.$gte = from;
    }
    if (dobTo) {
      const to = new Date(dobTo);
      if (!isNaN(to)) {
        to.setHours(23, 59, 59, 999);
        query.dateOfBirth.$lte = to;
      }
    }
  }

  return await User.find(query).select('-password');
};

const findUserById = async (id) => {
    return await User.findById(id);
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email }).populate('following', '_id');
};

const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, {new: true});
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

const addFollower = async (targetUserId, viewerId) => {
    await User.findByIdAndUpdate(targetUserId, {$addToSet: {followers: viewerId}});
    await User.findByIdAndUpdate(viewerId, {$addToSet: {following: targetUserId}});
};

const removeFollower = async (targetUserId, viewerId) => {
    await User.findByIdAndUpdate(targetUserId, {$pull: {followers: viewerId}});
    await User.findByIdAndUpdate(viewerId, {$pull: {following: targetUserId}});
};

const isFollowing = async (viewerId, targetUserId) => {
    const viewer = await User.findById(viewerId);
    return viewer?.following?.some(id => id.equals(targetUserId));
};

const findUserWithFollowersAndFollowing = async (userId) => {
    return User.findById(userId).select('-password')
        .populate('followers', 'fullName username profileImageUrl')
        .populate('following', 'fullName username profileImageUrl');
};


module.exports = {
    createUser,
    findAllUsers,
    findUserById,
    findUserByEmail,
    updateUser,
    deleteUser,
    addFollower,
    removeFollower,
    isFollowing,
    findUserWithFollowersAndFollowing,
};
