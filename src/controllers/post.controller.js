const postService = require('../services/post.service');

const createPost = async (req, res) => {
    try {
        const { content, groupId } = req.body;

        const newPost = await postService.createPost({
            content,
            author: req.user._id,
            groupId: groupId || null,
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ error: err.message });
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
    const userId = req.user._id;
    const post = await postService.getPostById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const isAuthor = post.author._id.toString() === userId.toString();

    let isGroupAdmin = false;
    if (post.groupId && post.groupId.adminId) {
    isGroupAdmin = post.groupId.adminId._id.toString() === userId.toString();
    }

    if (!isAuthor && !isGroupAdmin) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

    await postService.deletePost(post._id, userId);
    return res.status(204).end();
  } catch (err) {
    console.error('Failed to delete post:', err.message);
    return res.status(500).json({ error: 'Failed to delete post' });
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
