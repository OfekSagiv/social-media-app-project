const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const fullName = `${firstName} ${lastName}`;
        const username = email.split('@')[0];

        const user = await authService.register({
            username,
            fullName,
            email,
            password,
        });

        req.session.userId = user._id;
        req.session.fullName = user.fullName;

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.login({ email, password });

        req.session.userId = user._id;
        req.session.fullName = user.fullName;

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = { register, login, logout };
