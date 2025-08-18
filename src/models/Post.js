const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 300,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const mediaSchema = new mongoose.Schema({
    mediaUrl: {
        type: String,
        required: true,
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        required: true,
    }
}, { _id: false });

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
    },
    media: [mediaSchema],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [commentSchema],
    xShare: {
    requested: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'success', 'failed', null], default: null },
    tweetId: { type: String },
    tweetUrl: { type: String },
    postedAt: { type: Date },
    error: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
