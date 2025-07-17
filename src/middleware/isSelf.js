module.exports = (req, res, next) => {
    const sessionUserId = req.session?.user?._id;
    const targetUserId = req.params.id;

    if (!sessionUserId || sessionUserId.toString() !== targetUserId.toString()) {
        return res.status(403).json({ error: 'Unauthorized: You can only act on your own account.' });
    }

    next();
};
