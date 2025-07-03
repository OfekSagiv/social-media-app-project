const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        req.session.userId = user._id;
        req.session.fullName = user.fullName;
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const user = await authService.login(req.body);
        req.session.userId = user._id;
        req.session.fullName = user.fullName;
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = { register, login, logout };
