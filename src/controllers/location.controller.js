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

    const trimmedAddress = address.trim();
    if (trimmedAddress.length < 5) {
        return res.status(400).json({ error: 'Please enter a more detailed address.' });
    }

    if (trimmedAddress.length > 200) {
        return res.status(400).json({ error: 'Address is too long.' });
    }

    try {
        const updatedUser = await locationService.updateUserLocation(userId, trimmedAddress);

        if (!updatedUser) {
            return res.status(500).json({ error: 'Failed to update location in database' });
        }

        req.session.user.address = updatedUser.address;
        req.session.user.city = updatedUser.city;
        req.session.user.location = updatedUser.location;

        res.status(200).json({
            message: 'Location updated successfully',
            city: updatedUser.city
        });
    } catch (err) {
        console.error('Location update error:', err.message);
        res.status(500).json({ error: err.message || 'Failed to update location' });
    }
};

const deleteLocation = async (req, res) => {
    const userId = req.session.user._id;

    try {
        const updatedUser = await locationService.deleteUserLocation(userId);

        if (!updatedUser) {
            return res.status(500).json({ error: 'Delete returned null' });
        }

        req.session.user.address = '';
        req.session.user.city = '';
        req.session.user.location = null;

        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (err) {
        console.error('Failed to delete location:', err.message);
        res.status(500).json({ error: 'Failed to delete location' });
    }
};

const getUsersWithLocation = async (req, res) => {
    try {
        const city = req.query.city;
        const users = await locationService.getUsersWithLocation(city);
        res.status(200).json(users);
    } catch (err) {
        console.error('Failed to fetch users with location:', err);
        res.status(500).json({ error: 'Failed to fetch user locations' });
    }
};


module.exports = {
    renderEditForm,
    saveLocation,
    deleteLocation,
    getUsersWithLocation
};
