const Group = require('../models/Group');

const createGroup = async (groupData) => {
  return await Group.create(groupData);
};

const findAllGroups = async (filters = {}) => {
  return await Group.find(filters);
};

const findGroupById = async (groupId) => {
  return await Group.findById(groupId);
};

const findGroupByName = async (name) => {
  return await Group.findOne({ name });
};

const updateGroup = async (id, updateData) => {
  return await Group.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteGroup = async (id) => {
  return await Group.findByIdAndDelete(id);
};

const getGroupMembers = async (id) => {
  const group = await Group.findById(id);
  return group ? group.members : null;
};

const addMemberToGroup = async (groupId, userId) => {
  return await Group.findByIdAndUpdate(
    groupId,
    { $addToSet: { members: userId } },
    { new: true }
  );
};

const removeMemberFromGroup = async (groupId, userId) => {
  return await Group.findByIdAndUpdate(
    groupId,
    { $pull: { members: userId } },
    { new: true }
  );
};

const changeGroupAdmin = async (groupId, newAdminId) => {
  return await Group.findByIdAndUpdate(
    groupId,
    { adminId: newAdminId },
    { new: true }
  );
};

const getGroupsByMember = async (userId) => {
  return await Group.find({ members: userId });
};

module.exports = {
  createGroup,
  findAllGroups,
  findGroupById,
  findGroupByName,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  changeGroupAdmin,
  getGroupsByMember
};