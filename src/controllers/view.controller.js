const viewService = require('../services/view.service');
const userService = require('../services/user.service');
const groupService = require('../services/group.service');
const postService = require('../services/post.service');

const renderHome = async (req, res) => {
    try {
        const user = req.session.user;
        const homeData = await viewService.getHomePageData(user._id);

        res.render('home', {
            fullName: user.fullName,
            user,
            posts: homeData.posts,
            historyEvents: homeData.historyEvents
        });
    } catch (err) {
        console.error('Error fetching home page data:', err.message);
        res.status(500).render('error', {
            message: 'Failed to load feed. Please try again later.'
        });
    }
};

const renderMyPosts = async (req, res) => {
    try {
        const posts = await postService.getMyPosts(req.user._id);
        res.render('my-posts', {
            posts,
            user: req.user
        });
    } catch (err) {
        console.error('Error fetching my posts:', err.message);
        res.status(500).render('error', {message: 'Failed to load posts'});
    }
};

const renderGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const user = req.session.user;

        const groupData = await viewService.getGroupPageData(groupId, user._id);

        res.render('group', {
            group: groupData.group,
            posts: groupData.posts,
            user,
            fullName: user.fullName,
            isMember: groupData.isMember,
            members: groupData.members,
            postCount: groupData.postCount
        });
    } catch (err) {
        console.error('Error fetching group data:', err.message);
        res.status(404).render('error', {message: err.message});
    }
};

const renderProfile = async (req, res) => {
    try {
        const viewer = req.session.user;
        const userId = req.params.id || viewer._id;

        const profileData = await viewService.getProfilePageData(userId, viewer._id);

        res.render('profile', {
            user: profileData.user,
            viewer,
            posts: profileData.posts,
            postCount: profileData.postCount
        });
    } catch (err) {
        console.error('Error fetching profile data:', err.message);
        res.status(500).render('error', {
            message: err.message || 'Failed to load profile'
        });
    }
};

const renderMyGroups = async (req, res) => {
    try {
        const groups = await groupService.getGroupsByMember(req.user._id);
        res.render('my-groups', {groups, user: req.user});
    } catch (err) {
        console.error('Error fetching my groups:', err.message);
        res.status(500).render('error', {message: 'Failed to load groups'});
    }
};

const renderCreateGroup = (req, res) => {
    res.render('create-group', {user: req.user});
};

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
const renderUsersMap = (req, res) => {
    res.render('users-map', { user: req.session.user });
};

const renderSignup = (req, res) => {
    res.render('signup');
};

const renderLogin = (req, res) => {
    res.render('login');
};

const renderRoot = (req, res) => {
    const user = req.session?.user;
    if (user) return res.redirect('/home');
    res.redirect('/login');
};

const renderErrorTest = (req, res) => {
    res.status(500).render('error', {message: 'This is a test error page.'});
};

module.exports = {
    renderSignup,
    renderLogin,
    renderRoot,
    renderErrorTest,
    renderHome,
    renderMyPosts,
    renderGroup,
    renderProfile,
    renderMyGroups,
    renderCreateGroup,
    renderSettingsPage,
    updateSettings,
    searchUsersView,
    searchGroupsView,
    searchPostsView,
    renderUsersMap
};
