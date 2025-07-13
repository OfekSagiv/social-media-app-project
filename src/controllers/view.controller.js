const viewService = require('../services/view.service');

const updateSettings = async (req, res) => {
    try {
        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        const userId = req.user._id;
        const {
            fullName,
            bio,
            website,
            dateOfBirth,
            canBeFollowedBy,
            canBeCommentedBy,
        } = req.body;

        const updateData = {};

        if (fullName) updateData.fullName = fullName;
        if (bio) updateData.bio = bio;
        if (website) {
            const validUrl = /^https?:\/\/.+/i.test(website);
            if (!validUrl) return res.status(400).json({ message: 'Invalid website URL' });
            updateData.website = website;
        }
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
        if (canBeFollowedBy) updateData.canBeFollowedBy = canBeFollowedBy;
        if (canBeCommentedBy) updateData.canBeCommentedBy = canBeCommentedBy;

        if (req.file) {
            updateData.profileImageUrl = `/uploads/profiles/${req.file.filename}`;
        }

        const updatedUser = await viewService.updateUserSettings(userId, updateData);
        res.status(200).json({ message: 'Settings updated', user: updatedUser });
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ message: 'Failed to update settings' });
    }
};

module.exports = {
    renderSettingsPage: async (req, res) => {
        try {
            const user = req.user;
            res.render('settings', { user });
        } catch (err) {
            res.status(500).render('error', { message: 'Failed to load settings page' });
        }
    },
    updateSettings
};
