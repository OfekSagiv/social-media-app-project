const viewService = require('../services/view.service');
const userService = require('../services/user.service');
const groupService = require('../services/group.service');
const postService = require('../services/post.service');

const renderSettingsPage = async (req, res) => {
    try {
        res.render('settings', { user: req.user });
    } catch (err) {
        res.status(500).render('error', { message: 'Failed to load settings page' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedUser = await viewService.updateUserSettings(userId, req.body, req.file);

        req.session.user = updatedUser.toObject();
        res.status(200).json({ message: 'Settings updated', user: updatedUser });
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ message: err.message || 'Failed to update settings' });
    }
};

const searchUsersView = async (req, res) => {
  try {
    const filters = (({ fullName, bio, dobFrom, dobTo }) => ({ fullName, bio, dobFrom, dobTo }))(req.query);

    const results = await userService.getAllUsers(filters);

    res.render('search/users', { user: req.user, results, filters: req.query });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

const searchGroupsView = async (req, res) => {
    try {
        const { name, description, membersMin, membersMax, createdFrom, createdTo } = req.query;
        const filters = { name, description, membersMin, membersMax, createdFrom, createdTo };

        const results = await groupService.getAllGroups(filters);

        res.render('search/groups', {
            user: req.user,
            results,
            filters
        });
    } catch (err) {
        console.error('Error rendering group search:', err);
        res.status(500).render('error', {
            message: err.message || 'Failed to search groups',
            user: req.user
        });
    }
};

const searchPostsView = async (req, res) => {
    try {
        const filters = (({ content, authorName, groupName, createdFrom, createdTo }) => ({
            content, authorName, groupName, createdFrom, createdTo
        }))(req.query);

        const results = await postService.searchPosts(filters);

        res.render('search/posts', { user: req.user, results, filters });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
};

module.exports = {
    renderSettingsPage,
    updateSettings,
    searchUsersView,
    searchGroupsView,
    searchPostsView
};
