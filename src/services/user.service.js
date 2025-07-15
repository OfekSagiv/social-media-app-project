const userRepository = require('../repositories/user.repository');
const postService = require('./post.service');
const groupService = require('./group.service');
const cleanupUserDataFromPosts = require('../repositories/post.repository').cleanupUserDataFromPosts; 

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
    } catch (_) {
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
  deleteUserCompletely
};
