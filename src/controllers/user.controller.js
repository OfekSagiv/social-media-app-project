const userService = require('../services/user.service');

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.query);
        res.json(users);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({error: err.message});
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const toggleFollow = async (req, res) => {
    try {
        const viewerId = req.session.user?._id;
        const targetUserId = req.params.id;

        if (!viewerId) {
            return res.status(401).json({error: 'Not authenticated'});
        }

        const result = await userService.toggleFollow(viewerId, targetUserId);
        res.json(result);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleFollow
};
