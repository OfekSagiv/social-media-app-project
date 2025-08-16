const User = require('../models/User');

const updateUserLocation = async (userId, updateData) => {
    const updated = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).lean();

    return updated;
};

const getUsersWithLocation = async (cityFilter) => {
    const filter = { location: { $ne: null } };
    if (cityFilter) filter.city = cityFilter;

    return await User.find(filter)
        .select('fullName city location')
        .lean();
};

module.exports = {
    updateUserLocation,
    getUsersWithLocation
};
