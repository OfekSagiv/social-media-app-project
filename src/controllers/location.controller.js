const locationService = require('../services/location.service');

const renderEditForm = (req, res) => {
    res.render('location/edit', { user: req.session.user });
};

const saveLocation = async (req, res) => {
    const userId = req.session.user._id;
    const { address } = req.body;

    if (!address || typeof address !== 'string' || !address.trim()) {
        return res.status(400).json({ error: 'Address is required.' });
    }

    try {
        const updatedUser = await locationService.updateUserLocation(userId, address);

        if (!updatedUser) {
            return res.status(500).json({ error: 'Update returned null' });
        }

        req.session.user.address = updatedUser.address;
        req.session.user.city = updatedUser.city;

        res.status(200).json({ message: 'Location updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update location' });
    }
};

const deleteLocation = async (req, res) => {
    const userId = req.session.user._id;

    try {
        const updatedUser = await locationService.deleteUserLocation(userId);

        req.session.user.address = '';
        req.session.user.city = '';
        req.session.user.location = null;

        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (err) {
        console.error('Failed to delete location:', err.message);
        res.status(500).json({ error: 'Failed to delete location' });
    }
};

module.exports = {
    renderEditForm,
    saveLocation,
    deleteLocation
};
