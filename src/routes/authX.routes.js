const express = require('express');
const router = express.Router();
const authXController = require('../controllers/authX.controller');

router.get('/start', authXController.start);
router.get('/callback', authXController.callback);

module.exports = router;
