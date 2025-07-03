const Post = require('../models/Post');

const createPost = (data) => Post.create(data);

const getAllPosts = () => Post.find();

const getPostById = (id) => Post.findById(id);

const updatePostById = (id, updateData) => Post.findByIdAndUpdate(id, updateData, { new: true });

const deletePostById = (id) => Post.findByIdAndDelete(id);

const addComment = async (postId, commentData) => {
  return Post.findByIdAndUpdate(
      postId,
      {$push: {comments: commentData}},
      {new: true}
  );
};

const removeComment = async (postId, userId, createdAt) => {
  return Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: {
            userId,
            createdAt: new Date(createdAt),
          },
        },
      },
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
    removeComment
};
