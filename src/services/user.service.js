const userRepository = require('../repositories/user.repository');
const postService = require('./post.service');
const groupService = require('./group.service');
const cleanupUserDataFromPosts = require('../repositories/post.repository').cleanupUserDataFromPosts;
const bcrypt = require('bcrypt');

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
  const { username, dobFrom, dobTo } = filters;

  if (dobFrom && dobTo && new Date(dobFrom) > new Date(dobTo)) {
    throw new Error(`Date of birth "From" cannot be after Date of birth "To"`);
  }

  const users = await userRepository.findAllUsers(filters);

  if (username && users.length === 0) {
    throw new Error(`User with username "${username}" not found`);
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
  if (updateData.password) {
    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    updateData.password = hashedPassword;
  }

  const updated = await userRepository.updateUser(id, updateData);
  if (!updated) {
    throw new Error('User not found or update failed');
  }
  return updated;
};

const deleteUser = async (id) => {
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

const deleteUserCompletely = async (userId) => {

  const posts = await postService.getMyPosts(userId);
  for (const post of posts) {
    await postService.deletePost(post._id, userId);
  }

  const allGroups = await groupService.getAllGroups({});
  const adminGroups = allGroups.filter(group => group.adminId.toString() === userId.toString());

  for (const group of adminGroups) {
    await groupService.deleteGroup(group._id, userId);
  }

  const userGroups = await groupService.getGroupsByMember(userId);
  for (const group of userGroups) {
    try {
      await groupService.leaveGroup(group._id, userId);
    } catch (err) {
      console.warn(`Skipping group ${group._id} for user ${userId}: ${err.message}`);
    }
  }

  await cleanupUserDataFromPosts(userId);

  const allUsers = await userRepository.findAllUsers({});
  for (const otherUser of allUsers) {
    await userRepository.removeFollower(otherUser._id, userId);
    await userRepository.removeFollower(userId, otherUser._id);
  }

  await userRepository.deleteUser(userId);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleFollow,
  getUserWithFollowersAndFollowing,
  deleteUserCompletely,
};
