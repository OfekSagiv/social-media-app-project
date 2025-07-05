const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const {isLoggedIn} = require("../middleware/auth");

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

router.post('/:id/comments', isLoggedIn, postController.addComment);
router.delete('/:id/comments', isLoggedIn, postController.deleteComment);

router.post('/:id/like', isLoggedIn, postController.likePost);


module.exports = router;
