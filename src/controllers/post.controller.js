const postService = require('../services/post.service');

const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        const newPost = await postService.createPost({
        content,
        author: req.user._id
      });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

const updatePost = async (req, res) => {
    try {
        const updatedPost = await postService.updatePost(req.params.id, req.body);
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const deletePost = async (req, res) => {
    try {
        await postService.deletePost(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const addComment = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        const fullName = req.session.user?.fullName;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });

        const comment = {
            userId,
            content: req.body.text,
        };

        await postService.addCommentToPost(req.params.id, comment);

        res.status(201).json({ text: comment.content, authorName: fullName });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const {createdAt} = req.body;
        const userId = req.session.user?._id;
        const postId = req.params.id;

        const updatedPost = await postService.deleteCommentFromPost(postId, userId, createdAt);
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const likePost = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const updatedPost = await postService.toggleLike(req.params.id, userId);
        res.status(200).json({ likes: updatedPost.likes.length });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
    likePost,
};
