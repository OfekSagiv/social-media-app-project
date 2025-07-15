const postRepository = require('../repositories/post.repository');
const groupRepository = require('../repositories/group.repository');

const createPost = async (data) => {
    const {content, author, groupId} = data;

    if (!content) {
        throw new Error('Missing content');
    }
    if (!author) {
        throw new Error('Missing author');
    }

    if (groupId) {
        const group = await groupRepository.findGroupById(groupId);
        if (!group) throw new Error('Group not found');

        const isMember = group.members.some((id) => id.equals(author));
        if (!isMember) throw new Error('Only group members can post to this group');
    }

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

const getMyPosts = async (authorId) => {
  try {
    const posts = await postRepository.getPostsByAuthor(authorId);
    return posts;
  } catch (err) {
    throw new Error('Error fetching posts');
  }
};

const getPostsByGroupId = async (groupId) => {
    const posts = await postRepository.getPostsByGroup(groupId);
    return posts;
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    addCommentToPost,
    deleteCommentFromPost,
    toggleLike,
    getMyPosts,
    getPostsByGroupId
};
