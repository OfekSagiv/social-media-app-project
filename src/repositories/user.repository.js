const User = require('../models/User');

const createUser = async (userData) => {
  return await User.create(userData);
};

const findAllUsers = async (filters = {}) => {
  return await User.find(filters);
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  create: createUser,
  findAll: findAllUsers,
  findById: findUserById,
  findByEmail: findUserByEmail,
  update: updateUser,
  delete: deleteUser,
};
