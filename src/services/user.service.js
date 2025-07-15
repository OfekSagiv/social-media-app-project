const userRepository = require('../repositories/user.repository');

const checkIfExists = async (field, value, message) => {
  const query = {};
  query[field] = value;
  const existing = await userRepository.findAllUsers(query);
  if (existing.length > 0) {
    throw new Error(message);
  }
};

const createUser = async (userData) => {
  await checkIfExists('email', userData.email, 'Email already in use');
  await checkIfExists('username', userData.username, 'Username already taken');

  return await userRepository.createUser(userData);
};

const getAllUsers = async (filters) => {
  const users = await userRepository.findAllUsers(filters);

  if (filters.username && users.length === 0) {
    throw new Error(`User with username "${filters.username}" not found`);
  }

  return users;
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUser = async (id, updateData) => {
  const updated = await userRepository.updateUser(id, updateData);
  if (!updated) {
    throw new Error('User not found or update failed');
  }
  return updated;
};

const deleteUser = async (id) => {
  await userRepository.removeUserFromFollowersAndFollowing(id);
  const deleted = await userRepository.deleteUser(id);
  if (!deleted) {
    throw new Error('User not found or delete failed');
  }
  return deleted;
};

const toggleFollow = async (viewerId, targetUserId) => {
  if (viewerId.toString() === targetUserId.toString()) {
    throw new Error("Can't follow yourself");
  }

  const alreadyFollowing = await userRepository.isFollowing(viewerId, targetUserId);

  if (alreadyFollowing) {
    await userRepository.removeFollower(targetUserId, viewerId);
    return { action: 'unfollowed' };
  } else {
    await userRepository.addFollower(targetUserId, viewerId);
    return { action: 'followed' };
  }
};
const getUserWithFollowersAndFollowing = async (userId) => {
  const user = await userRepository.findUserWithFollowersAndFollowing(userId);
  if (!user) throw new Error('User not found');
  return user;
};

const removeUserFromAllFollowersAndFollowing = async (userId) => {
  await userRepository.removeUserFromFollowersAndFollowing(userId);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleFollow,
  getUserWithFollowersAndFollowing,
  removeUserFromAllFollowersAndFollowing
};
