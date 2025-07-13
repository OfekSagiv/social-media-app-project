const viewRepository = require('../repositories/view.repository');

const updateUserSettings = async (userId, updateFields) => {
    return await viewRepository.updateUserById(userId, updateFields);
};

module.exports = {
    updateUserSettings
};
