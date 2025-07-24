const postRepository = require('../repositories/post.repository');
const groupRepository = require('../repositories/group.repository');
const userRepository = require('../repositories/user.repository');
const { countPostsByUser: countPostsByUserRepo } = require('../repositories/post.repository');
const Post = require('../models/Post');

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

const updatePost = async (postId, updateData, userId) => {
  const post = await postRepository.getPostById(postId);
  if (!post) throw new Error('Post not found');

  const isAuthor = post.author.equals(userId);
  let isGroupAdmin = false;

  if (post.groupId) {
    const group = await groupRepository.findGroupById(post.groupId);
    if (group && group.adminId.equals(userId)) {
      isGroupAdmin = true;
    }
  }

  if (!isAuthor && !isGroupAdmin) {
    throw new Error('Unauthorized to edit this post');
  }

  return await postRepository.updatePostById(postId, updateData);
};

const deletePost = async (postId, userId) => {
    const post = await postRepository.getPostById(postId);
    if (!post) throw new Error('Post not found');

    if (post.author.equals(userId)) {
        return await postRepository.deletePostById(postId);
    }

    if (post.groupId) {
        const group = await groupRepository.findGroupById(post.groupId);
        if (group && group.adminId.equals(userId)) {
            return await postRepository.deletePostById(postId);
        }
    }

    throw new Error("You are not authorized to delete this post");
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

const countPostsByUser = async (userId) => {
   return await countPostsByUserRepo(userId);
 };

const countPostsInGroupByMembers = async (groupId) => {
    return await postRepository.countPostsInGroupByMembers(groupId);
};

const getFeedPostsForUser = async (userId) => {
    const myPosts = await postRepository.getPostsByAuthor(userId);

    const user = await userRepository.findUserById(userId);
    if (!user) throw new Error('User not found');

    const followingIds = user.following || [];
    const followedPosts = await Post.find({ author: { $in: followingIds } })
        .populate('author', 'fullName profileImageUrl')
        .populate('groupId', 'name')
        .populate('comments.userId', 'fullName')
        .sort({ createdAt: -1 });

    const groups = await groupRepository.getGroupsByMember(userId) || [];
    const groupIds = groups.map(g => g._id);
    const groupPosts = await Post.find({ groupId: { $in: groupIds } })
        .populate('author', 'fullName profileImageUrl')
        .populate('groupId', 'name')
        .populate('comments.userId', 'fullName')
        .sort({ createdAt: -1 });

    const allPosts = [...myPosts, ...followedPosts, ...groupPosts];

    const uniquePostsMap = new Map();
    allPosts.forEach(post => {
        uniquePostsMap.set(post._id.toString(), post);
    });

    const uniquePosts = Array.from(uniquePostsMap.values());
    uniquePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return uniquePosts;
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
    getPostsByGroupId,
    countPostsByUser,
    countPostsInGroupByMembers,
    getFeedPostsForUser
};
