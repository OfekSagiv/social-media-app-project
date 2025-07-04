const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;

        const fullName = `${firstName} ${lastName}`;
        const username = email.split('@')[0];

        const user = await authService.register({
            username,
            fullName,
            email,
            password,
        });

        req.session.user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email, username: user.username,
            profileImage: user.profileImage || '/img/default-avatar.png',
        };
        res.status(201).json({message: 'User registered successfully'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await authService.login({email, password});

        req.session.user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage || '/img/default-avatar.png',
        };

        res.status(200).json({message: 'Login successful'});
    } catch (err) {
        res.status(401).json({success: false, message: 'Invalid credentials'});
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({error: 'Logout failed'});
        res.redirect('/login');
    });
};

module.exports = {register, login, logout};
