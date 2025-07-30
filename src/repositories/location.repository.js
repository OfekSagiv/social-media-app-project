const User = require('../models/User');

const updateUserLocation = async (userId, updateData) => {
    const updated = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).lean();

    return updated;
};

module.exports = {
    updateUserLocation
};
