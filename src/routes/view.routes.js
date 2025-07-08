const express = require('express');
const router = express.Router();
const {isLoggedIn } = require('../middleware/auth');
const { getAllPosts, getPostsByGroupId ,getMyPosts} = require("../services/post.service");
const { getGroupById, getGroupMembers } = require("../services/group.service");

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
        });
    } catch (err) {
        res.status(404).render('error', { message: err.message });
    }
});

module.exports = router;
