const Post = require('../models/Post');

const createPost = (data) => Post.create(data);

const getAllPosts = () => Post.find();

const getPostById = (id) => Post.findById(id);

const updatePostById = (id, updateData) => Post.findByIdAndUpdate(id, updateData, { new: true });

const deletePostById = (id) => Post.findByIdAndDelete(id);

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
