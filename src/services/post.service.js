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

    const comment = await postRepository.getComment(postId, userId, createdAt);
    if (!comment) throw new Error('Comment not found');

    return await postRepository.removeComment(postId, userId, createdAt);
};

const toggleLike = async (postId, userId) => {
    const post = await postRepository.getPostById(postId);
    if (!post) throw new Error('Post not found');

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
        return await postRepository.removeLike(postId, userId);
    } else {
        return await postRepository.addLike(postId, userId);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addCommentToPost,
    deleteCommentFromPost,
    toggleLike
};
