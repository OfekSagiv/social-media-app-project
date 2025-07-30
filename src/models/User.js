const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    fullName: {
        type: String,
        required: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+@.+\..+/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profileImageUrl: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        maxlength: 160,
        default: '',
    },
    website: {
        type: String,
        default: '',
        match: /^https?:\/\/.+/i,
    },
    dateOfBirth: {
        type: Date,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    location: {
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
