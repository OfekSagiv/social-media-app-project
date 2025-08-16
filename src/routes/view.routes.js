const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const {getPostsByGroupId, getMyPosts, countPostsByUser, countPostsInGroupByMembers} = require("../services/post.service");
const {getGroupById, getGroupMembers} = require("../services/group.service");
const {getUserById} = require('../services/user.service');
const groupController = require('../controllers/group.controller');
const userController = require('../controllers/user.controller');
const viewController = require('../controllers/view.controller');
const { getFeedPostsForUser } = require('../services/post.service');
const statisticsController = require('../controllers/statistics.controller');


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/', (req, res) => {
    const user = req.session?.user;
    if (user) return res.redirect('/home');
    res.redirect('/login');
});

router.get('/home', isLoggedIn, async (req, res) => {
    const user = req.session.user;
    const HISTORY_EVENTS_LIMIT = 5;

    try {
        const posts = await getFeedPostsForUser(user._id);

        let historyEvents = [];
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        try {
            const historyRes = await fetch('https://history.muffinlabs.com/date', {
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (!historyRes.ok) {
                throw new Error(`History API returned status ${historyRes.status}`);
            }

            const historyData = await historyRes.json();
            historyEvents = historyData?.data?.Events?.slice(0, HISTORY_EVENTS_LIMIT) || [];
        } catch (historyErr) {
            console.warn('Failed to fetch history events:', historyErr.name === 'AbortError' ? 'Request timed out' : historyErr.message);
            historyEvents = [];
        }

        res.render('home', {
            fullName: user.fullName,
            user,
            posts,
            historyEvents
        });
    } catch (err) {
        console.error('Error fetching feed:', err.message);
        res.status(500).render('error', {
            message: 'Failed to load feed. Please try again later.'
        });
    }
});

router.get('/error-test', (req, res) => {
    res.status(500).render('error', {message: 'This is a test error page.'});
});

router.get('/my-posts', isLoggedIn, async (req, res) => {
    try {
        const posts = await getMyPosts(req.user._id);
        res.render('my-posts', {
            posts,
            user: req.user
        });
    } catch (err) {
        res.status(500).render('error', {message: 'Failed to load posts'});
    }
});

router.get('/group/:id', isLoggedIn, async (req, res) => {
    const groupId = req.params.id;
    const user = req.session.user;

    try {
        const group = await getGroupById(groupId);
        const members = await getGroupMembers(groupId);
        const posts = await getPostsByGroupId(groupId);
        const postCount = await countPostsInGroupByMembers(groupId);

        const isMember = members.some(member => member._id.toString() === user._id);

        res.render('group', {
            group,
            posts,
            user,
            fullName: user.fullName,
            isMember,
            members,
            postCount
        });
    } catch (err) {
        res.status(404).render('error', {message: err.message});
    }
});

router.get('/create-group', isLoggedIn, (req, res) => {
    res.render('create-group', {user: req.user});
});

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const viewer = req.session.user;
        const posts = await getMyPosts(viewer._id);
        const postCount = await countPostsByUser(viewer._id);

        res.render('profile', {
            user: viewer,
            viewer,
            posts,
            postCount
        });
    } catch (err) {
        res.status(500).render('error', {message: 'Failed to load profile'});
    }
});

router.get('/profile/:id', isLoggedIn, async (req, res) => {
    const viewer = req.session.user;
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).render('error', {message: 'User not found'});
        }

        const posts = await getMyPosts(userId);
        const postCount = await countPostsByUser(userId);

        res.render('profile', {
            user,
            viewer,
            posts,
            postCount
        });
    } catch (err) {
        res.status(500).render('error', {message: err.message || 'Failed to load profile'});
    }
});

router.get('/my-groups', isLoggedIn, async (req, res) => {
    try {
        const groups = await groupController.getMyGroups(req.user._id);
        res.render('my-groups', {groups, user: req.user});
    } catch (err) {
        res.status(500).render('error', {message: 'Failed to load groups'});
    }
});

router.get('/my-following-followers', isLoggedIn, userController.getMyFollowersAndFollowing);

router.get('/settings', isLoggedIn, viewController.renderSettingsPage);

router.get('/search/users', isLoggedIn, viewController.searchUsersView);


router.get('/statistics', isLoggedIn, statisticsController.renderStatisticsPage);

router.get('/search/groups', isLoggedIn, viewController.searchGroupsView);


router.get('/search/posts', isLoggedIn, viewController.searchPostsView);

router.get('/map', isLoggedIn, viewController.renderUsersMap);

module.exports = router;
