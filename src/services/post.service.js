const postRepository = require('../repositories/post.repository');

const createPost = async (data) => {
    return await postRepository.createPost(data);
};

const getAllPosts = async () => {
    return await postRepository.getAllPosts();
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

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
};
