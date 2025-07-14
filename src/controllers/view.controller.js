const viewService = require('../services/view.service');

const renderSettingsPage = async (req, res) => {
    try {
        res.render('settings', { user: req.user });
    } catch (err) {
        res.status(500).render('error', { message: 'Failed to load settings page' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedUser = await viewService.updateUserSettings(userId, req.body, req.file);

        req.session.user = updatedUser.toObject();
        res.status(200).json({ message: 'Settings updated', user: updatedUser });
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ message: err.message || 'Failed to update settings' });
    }
};

module.exports = {
    renderSettingsPage,
    updateSettings
};
