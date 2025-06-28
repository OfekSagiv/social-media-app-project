const userRepository = require('../repositories/user.repository');

const createUser = async (userData) => {
  const existing = await userRepository.findUserByEmail(userData.email);
  if (existing) {
    throw new Error('Email already in use');
  }
  return await userRepository.createUser(userData);
};

const getAllUsers = async (filters) => {
  return await userRepository.findAllUsers(filters);
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
