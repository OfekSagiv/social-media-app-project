const viewRepository = require('../repositories/view.repository');
const { buildValidatedUpdateData } = require('../utils/settingsValidator');

const updateUserSettings = async (userId, body, file) => {
    const updateFields = buildValidatedUpdateData(body, file);
    return await viewRepository.updateUserById(userId, updateFields);
};

module.exports = {
    updateUserSettings
};
