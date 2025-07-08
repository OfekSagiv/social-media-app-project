const groupService = require('../services/group.service');

const createGroup = async (req, res) => {
  try {
    const groupData = {
      ...req.body,
      adminId: req.user._id,
      members: [req.user._id],
    };

    const group = await groupService.createGroup(groupData);
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups(req.query);
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    res.json(group);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const updatedGroup = await groupService.updateGroup(req.params.id, req.body);
    res.json(updatedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    await groupService.deleteGroup(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const members = await groupService.getGroupMembers(req.params.id);
    res.json(members);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const group = await groupService.joinGroup(req.params.id, userId);
    res.status(200).json({ message: 'Joined group', members: group.members });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const group = await groupService.leaveGroup(req.params.id, userId);
    res.status(200).json({ message: 'Left group', members: group.members });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const changeGroupAdmin = async (req, res) => {
  try {
    const group = await groupService.changeGroupAdmin(req.params.id, req.body.newAdminId);
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await groupService.getGroupsByMember(userId);
    res.render('my-groups', { groups, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to load groups' });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  changeGroupAdmin,
  getMyGroups
};
