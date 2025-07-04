const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

router.post('/:id/comments', postController.addComment);
router.delete('/:id/comments', postController.deleteComment);

module.exports = router;
