const Post = require('../models/Post');
const mongoose = require('mongoose');

const createPost = (data) => Post.create(data);

const getAllPosts = () => {
    return Post.find()
        .populate('author', 'fullName profileImageUrl')
        .populate('groupId', 'name')
        .populate('comments.userId', 'fullName')
        .sort({ createdAt: -1 });
};

const getPostById = (id) => {
  return Post.findById(id)
    .populate('author', 'fullName')
    .populate({
      path: 'groupId',
      select: 'name adminId',
      populate: {
        path: 'adminId',
        model: 'User',
        select: '_id'
      }
    })
    .populate('comments.userId', 'fullName');
};

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
        .populate('author', 'fullName profileImageUrl')
        .populate('comments.userId', 'fullName');
};

const removeComment = async (postId, userId, createdAt) => {
    return Post.findByIdAndUpdate(
        postId,
        {
            $pull: {
                comments: {
                    userId: userId,
                    createdAt: {
                        $gte: new Date(new Date(createdAt).getTime() - 1000),
                        $lte: new Date(new Date(createdAt).getTime() + 1000)
                    }
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

const getPostsByAuthor = async (authorId) => {
    return await Post.find({ author: authorId })
        .populate('author', 'fullName profileImageUrl')
        .populate('groupId', 'name')
        .populate('comments.userId', 'fullName')
        .sort({ createdAt: -1 });
};
const getPostsByGroup = (groupId) => {
    return Post.find({ groupId })
        .populate('author', 'fullName') 
        .populate({
            path: 'groupId',
            select: 'name adminId',
            populate: {
                path: 'adminId',
                model: 'User', 
                select: '_id'
            }
        })
        .populate('author', 'fullName profileImageUrl')
        .populate('groupId', 'name')
        .populate('comments.userId', 'fullName')
        .sort({ createdAt: -1 });
};

const deletePostsByGroupId = async (groupId) => {
  return await Post.deleteMany({ groupId });
};

const countPostsByUser = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const result = await Post.aggregate([
    { $match: { author: objectId } },
    {
      $group: {
        _id: '$author',
        totalPosts: { $sum: 1 }
      }
    }
  ]);
  return result[0]?.totalPosts || 0;
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
    removeLike,
    getPostsByAuthor,
    getPostsByGroup,
    deletePostsByGroupId,
    countPostsByUser
};
