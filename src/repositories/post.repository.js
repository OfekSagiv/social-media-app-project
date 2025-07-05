const Post = require('../models/Post');

const createPost = (data) => Post.create(data);

const getAllPosts = () => {
    return Post.find()
        .populate('author', 'fullName')
        .populate('comments.userId', 'fullName')
        .sort({ createdAt: -1 });
};

const getPostById = (id) => Post.findById(id);

const updatePostById = (id, updateData) => Post.findByIdAndUpdate(id, updateData, {new: true});

const deletePostById = (id) => Post.findByIdAndDelete(id);

const addComment = async (postId, comment) => {
    await Post.findByIdAndUpdate(
        postId,
        {
            $push: {
                comments: {
                    userId: comment.userId,
                    content: comment.content,
                    createdAt: new Date(),
                },
            },
        }
    );

    return Post.findById(postId)
        .populate('author', 'fullName')
        .populate('comments.userId', 'fullName');
};

const removeComment = async (postId, userId, createdAt) => {
    return Post.findByIdAndUpdate(
        postId,
        {
            $pull: {
                comments: {
                    userId: userId,
                    createdAt: new Date(createdAt),
                },
            },
        },
        { new: true }
    );
};

const addLike = async (postId, userId) => {
    return Post.findByIdAndUpdate(
        postId,
        {$addToSet: {likes: userId}},
        {new: true}
    );
};

const removeLike = async (postId, userId) => {
    return Post.findByIdAndUpdate(
        postId,
        {$pull: {likes: userId}},
        {new: true}
    );
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    addComment,
    removeComment,
    addLike,
    removeLike
};
