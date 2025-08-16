const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');

const register = async ({ username, fullName, email, password }) => {
    if (!username || !fullName || !email || !password) {
        throw new Error('All fields are required');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Please enter a valid email address');
    }

    const existing = await userRepository.findUserByEmail(email);
    if (existing) throw new Error('An account with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.createUser({ username, fullName, email, password: hashedPassword });
};

const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error('No account found with this email address');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;
};

module.exports = { register, login };
