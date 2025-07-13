const express = require('express');
const router = express.Router();
const {isLoggedIn } = require('../middleware/auth');
const { getAllPosts, getPostsByGroupId ,getMyPosts} = require("../services/post.service");
const { getGroupById, getGroupMembers } = require("../services/group.service");
const { getUserById } = require('../services/user.service');
const groupController = require('../controllers/group.controller');
const userController = require('../controllers/user.controller');



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

    try {
        const posts = await getAllPosts();


        res.render('home', {
            fullName: user.fullName,
            user,
            posts
        });

    } catch (err) {
        console.error('Error fetching posts:', err.message);
        res.status(500).render('error', {
            message: 'Failed to load posts. Please try again later.'
        });
    }
});

router.get('/error-test', (req, res) => {
    res.status(500).render('error', { message: 'This is a test error page.' });
});

router.get('/my-posts', isLoggedIn, async (req, res) => {
  try {
    const posts = await getMyPosts(req.user._id);
    res.render('my-posts', {
      posts,
      user: req.user
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to load posts' });
  }
});

router.get('/group/:id', isLoggedIn, async (req, res) => {
    const groupId = req.params.id;
    const user = req.session.user;

    try {
        const group = await getGroupById(groupId);
        const members = await getGroupMembers(groupId);
        const posts = await getPostsByGroupId(groupId);

        const isMember = members.some(member => member._id.toString() === user._id);

        res.render('group', {
            group,
            posts,
            user,
            fullName: user.fullName,
            isMember,
            members,
        });
    } catch (err) {
        res.status(404).render('error', { message: err.message });
    }
});

router.get('/create-group', isLoggedIn, (req, res) => {
  res.render('create-group', { user: req.user });
});

router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const viewer = req.session.user;
    const posts = await getMyPosts(viewer._id);

    res.render('profile', {
      user: viewer,
      viewer,
      posts
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
});

router.get('/profile/:id', isLoggedIn, async (req, res) => {
  const viewer = req.session.user;
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    const posts = await getMyPosts(userId);

    res.render('profile', {
      user,
      viewer,
      posts
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message || 'Failed to load profile' });
  }
});

router.get('/my-groups', isLoggedIn, async (req, res) => {
  try {
    const groups = await groupController.getMyGroups(req.user._id);
    res.render('my-groups', { groups, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to load groups' });
  }
});

router.get('/my-following-followers', isLoggedIn, userController.getMyFollowersAndFollowing);

module.exports = router;
