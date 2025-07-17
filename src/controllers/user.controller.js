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
         if (req.session.user && req.session.user._id.toString() === updatedUser._id.toString()) {
             req.session.user = updatedUser;
         }
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const sessionUserId = req.session.user?._id;

        await userService.deleteUserCompletely(userId);
        req.session.destroy();
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const viewerId = req.session.user?._id;
        const targetUserId = req.params.id;

        if (!viewerId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const result = await userService.toggleFollow(viewerId, targetUserId);

        if (result.action === 'followed') {
            if (!Array.isArray(req.session.user.following)) {
                req.session.user.following = [];
            }
            req.session.user.following.push(targetUserId);
        } else {
            req.session.user.following = Array.isArray(req.session.user.following)
                ? req.session.user.following.filter(id => id !== targetUserId)
                : [];
        }

        req.session.save(err => {
            if (err) console.error('Failed to save session:', err.message);
        });

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const getMyFollowersAndFollowing = async (req, res) => {
    try {
        const userId = req.user._id;
        const populatedUser = await userService.getUserWithFollowersAndFollowing(userId);

        res.render('my-following-followers', {
            user: populatedUser,
            followers: populatedUser.followers,
            following: populatedUser.following
        });
    } catch (err) {
        console.error('Failed to load followers/following:', err);
        res.status(500).render('error', { message: 'Failed to load followers/following' });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleFollow,
    getMyFollowersAndFollowing
};
