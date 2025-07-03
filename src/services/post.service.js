const postRepository = require('../repositories/post.repository');

const createPost = async (data) => {
    return await postRepository.createPost(data);
};

const getAllPosts = async () => {
    return postRepository.getAllPosts();
};

const getPostById = async (id) => {
    const post = await postRepository.getPostById(id);
    if (!post) throw new Error('Post not found');
    return post;
};

const updatePost = async (id, updateData) => {
    const post = await postRepository.updatePostById(id, updateData);
    if (!post) throw new Error('Post not found or update failed');
    return post;
};

const deletePost = async (id) => {
    const result = await postRepository.deletePostById(id);
    if (!result) throw new Error('Post not found or delete failed');
    return result;
};

const addCommentToPost = async (postId, commentData) => {
    const post = await postRepository.getPostById(postId);
    if (!post) throw new Error('Post not found');

    if (!commentData.content || commentData.content.trim() === '') {
        throw new Error('Comment content is required');
    }

    return await postRepository.addComment(postId, commentData);
};

const deleteCommentFromPost = async (postId, userId, createdAt) => {
    const post = await postRepository.getPostById(postId);
    if (!post) throw new Error('Post not found');

    const comment = post.comments.find(
        (c) =>
            c.userId.toString() === userId &&
            new Date(c.createdAt).getTime() === new Date(createdAt).getTime()
    );

    if (!comment) throw new Error('Comment not found or already deleted');

    return await postRepository.removeComment(postId, userId, createdAt);
};
module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addCommentToPost,
    deleteCommentFromPost
};
