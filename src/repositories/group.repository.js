const Group = require('../models/Group');
const sanitize = require('../utils/sanitize');
const isValidISODate = require('../utils/validateDate');

const createGroup = async (groupData) => {
  return await Group.create(groupData);
};

const findAllGroups = async ({ name, description, membersMin, membersMax, createdFrom, createdTo } = {}) => {
  const query = {};

  const cleanName = sanitize(name);
  const cleanDescription = sanitize(description);

  if (cleanName) {
    query.name = { $regex: cleanName, $options: 'i' };
  }

  if (cleanDescription) {
    query.description = { $regex: cleanDescription, $options: 'i' };
  }

  const min = parseInt(membersMin);
  const max = parseInt(membersMax);
  if (!isNaN(min)) {
    query.memberCount = { ...query.memberCount, $gte: min };
  }
  if (!isNaN(max)) {
    query.memberCount = { ...query.memberCount, $lte: max };
  }

  if (createdFrom || createdTo) {
    query.createdAt = {};

    if (createdFrom && isValidISODate(createdFrom)) {
      query.createdAt.$gte = new Date(createdFrom);
    }

    if (createdTo && isValidISODate(createdTo)) {
      const to = new Date(createdTo);
      to.setHours(23, 59, 59, 999);
      query.createdAt.$lte = to;
    }

    if (Object.keys(query.createdAt).length === 0) {
      delete query.createdAt;
    }
  }

  return await Group.find(query).populate('adminId', 'fullName');
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

const getGroupMembers = async (groupId) => {
  const group = await Group.findById(groupId).populate('members', 'fullName username profileImageUrl');
  return group ? group.members : [];
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
