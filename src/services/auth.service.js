const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');

const register = async ({ username, fullName, email, password }) => {
    const existing = await userRepository.findUserByEmail(email);
    if (existing) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.createUser({ username, fullName, email, password: hashedPassword });
};

const login = async ({ email, password }) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    return user;
};

module.exports = { register, login };
