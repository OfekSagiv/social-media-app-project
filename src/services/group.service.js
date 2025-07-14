const groupRepository = require('../repositories/group.repository');
const userRepository = require('../repositories/user.repository');
const mongoose = require('mongoose');
const Group = require('../models/Group');


const checkIfExists = async (field, value, message) => {
  const query = {};
  query[field] = value;
  const existing = await groupRepository.findAllGroups(query);
  if (existing.length > 0) {
    throw new Error(message);
  }
};

const createGroup = async (groupData) => {
  await checkIfExists('name', groupData.name, 'Group name already exists');
  return await groupRepository.createGroup(groupData);
};

const getAllGroups = async (filters) => {
  const groups = await groupRepository.findAllGroups(filters);
  if (filters.name && groups.length === 0) {
    throw new Error(`Group with name "${filters.name}" not found`);
  }
  return groups;
};

const getGroupById = async (id) => {
  const group = await Group.findById(id).populate('members');
  if (!group) {
    throw new Error('Group not found');
  }
  return group;
};

const updateGroup = async (id, updateData) => {
  const updated = await groupRepository.updateGroup(id, updateData);
  if (!updated) {
    throw new Error('Group not found or update failed');
  }
  return updated;
};

const deleteGroup = async (id) => {
  const deleted = await groupRepository.deleteGroup(id);
  if (!deleted) {
    throw new Error('Group not found or delete failed');
  }
  return deleted;
};

const getGroupMembers = async (id) => {
  const members = await groupRepository.getGroupMembers(id);
  if (!members) {
    throw new Error('Group not found or has no members');
  }
  return members;
};

const joinGroup = async (groupId, userId) => {
  const group = await groupRepository.findGroupById(groupId);
  if (!group) throw new Error('Group not found');

  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error('User not found');

  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (group.members.includes(userObjectId)) {
    throw new Error('User already in group');
  }

  return await groupRepository.addMemberToGroup(groupId, userObjectId);
};

const leaveGroup = async (groupId, userId) => {
  const group = await groupRepository.findGroupById(groupId);
  if (!group) throw new Error('Group not found');

  const userObjectId = new mongoose.Types.ObjectId(userId);

  if (group.adminId.equals(userObjectId)) {
    throw new Error('Admin cannot leave the group. Please assign a new admin first.');
  }

  if (!group.members.includes(userObjectId)) {
    throw new Error('User is not a member of this group');
  }

  return await groupRepository.removeMemberFromGroup(groupId, userObjectId);
};

const changeGroupAdmin = async (groupId, newAdminId) => {
  const group = await groupRepository.findGroupById(groupId);
  if (!group) throw new Error('Group not found');

  const newAdminObjectId = new mongoose.Types.ObjectId(newAdminId);

  if (!group.members.includes(newAdminObjectId)) {
    throw new Error('New admin must be a member of the group');
  }

  return await groupRepository.changeGroupAdmin(groupId, newAdminObjectId);
};

const getGroupsByMember = async (userId) => {
  return await groupRepository.getGroupsByMember(userId);
};

const deleteGroupsByAdmin = async (adminId) => {
  return await groupRepository.deleteGroupsByAdmin(adminId);
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  leaveGroup,
  joinGroup,
  changeGroupAdmin,
  getGroupsByMember,
  deleteGroupsByAdmin
};
