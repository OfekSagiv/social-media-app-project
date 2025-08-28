const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authXController = require('../controllers/authX.controller');
const { isLoggedIn, isLoggedOut } = require('../middleware/auth');

router.post('/register', isLoggedOut, authController.register);
router.post('/login', isLoggedOut, authController.login);
router.post('/logout', isLoggedIn, authController.logout);

router.get('/x/start', isLoggedIn, authXController.start);
router.get('/x/callback', isLoggedIn, authXController.callback);
router.get('/x/disconnect', isLoggedIn, authXController.disconnect);

module.exports = router;
