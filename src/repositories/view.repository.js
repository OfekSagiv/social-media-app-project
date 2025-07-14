const User = require('../models/User');

const updateUserById = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports = {
    updateUserById
};
