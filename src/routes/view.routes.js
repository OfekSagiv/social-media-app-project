const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/auth');
const viewController = require('../controllers/view.controller');
const userController = require('../controllers/user.controller');
const statisticsController = require('../controllers/statistics.controller');

router.get('/signup', viewController.renderSignup);
router.get('/login', viewController.renderLogin);
router.get('/', viewController.renderRoot);
router.get('/home', isLoggedIn, viewController.renderHome);
router.get('/history', isLoggedIn, viewController.renderHistory);
router.get('/error-test', viewController.renderErrorTest);
router.get('/my-posts', isLoggedIn, viewController.renderMyPosts);
router.get('/group/:id', isLoggedIn, viewController.renderGroup);
router.get('/create-group', isLoggedIn, viewController.renderCreateGroup);
router.get('/profile', isLoggedIn, viewController.renderProfile);
router.get('/profile/:id', isLoggedIn, viewController.renderProfile);
router.get('/my-groups', isLoggedIn, viewController.renderMyGroups);
router.get('/my-following-followers', isLoggedIn, userController.getMyFollowersAndFollowing);
router.get('/settings', isLoggedIn, viewController.renderSettingsPage);
router.get('/search/users', isLoggedIn, viewController.searchUsersView);
router.get('/statistics', isLoggedIn, statisticsController.renderStatisticsPage);
router.get('/search/groups', isLoggedIn, viewController.searchGroupsView);
router.get('/search/posts', isLoggedIn, viewController.searchPostsView);
router.get('/map', isLoggedIn, viewController.renderUsersMap);
router.get('/x-auth', isLoggedIn, viewController.renderXAuth);

module.exports = router;
