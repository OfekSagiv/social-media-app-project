const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { isLoggedIn } = require('../middleware/auth');

router.get('/edit', isLoggedIn, locationController.renderEditForm);
router.post('/edit', isLoggedIn, locationController.saveLocation);

module.exports = router;
