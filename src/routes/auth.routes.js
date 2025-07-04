const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isLoggedIn, isLoggedOut } = require('../middleware/auth');

router.post('/register', isLoggedOut, authController.register);
router.post('/login', isLoggedOut, authController.login);
router.post('/logout', isLoggedIn, authController.logout);

module.exports = router;
