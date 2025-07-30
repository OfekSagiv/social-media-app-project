const groupService = require('../services/group.service');
const postService = require('../services/post.service');

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
    const posts = await postService.getPostsByGroupId(req.params.id);
    const members = await groupService.getGroupMembers(req.params.id);
    const postCount = await postService.countPostsInGroupByMembers(req.params.id);

    const isMember = group.members.some((m) => m._id.toString() === req.user._id.toString());

    res.render('group', {
      user: req.user,
      group,
      members,
      posts,
      isMember,
      postCount
    });
  } catch (err) {
    res.status(404).render('error', { message: err.message });
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
    const group = await groupService.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (group.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only admin can delete group' });
    }

    await groupService.deleteGroup(req.params.id, req.user._id);
    res.status(204).end();
  } catch (err) {
    console.error('Delete group failed:', err.message);
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

const getMyGroups = async (userId) => {
  return await groupService.getGroupsByMember(userId);
};

const searchGroups = async (req, res) => {
  try {
    const { name, description, membersMin, membersMax, createdFrom, createdTo } = req.query;

    const filters = { name, description, membersMin, membersMax, createdFrom, createdTo };

    const groups = await groupService.getAllGroups(filters);

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error searching groups:', error);
    res.status(500).json({ error: 'Failed to search groups' });
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
  searchGroups,
  getMyGroups
};
