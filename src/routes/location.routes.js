const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { isLoggedIn } = require('../middleware/auth');

router.get('/edit', isLoggedIn, locationController.renderEditForm);
router.post('/edit', isLoggedIn, locationController.saveLocation);
router.delete('/delete', isLoggedIn, locationController.deleteLocation);
router.get('/with-location', isLoggedIn, locationController.getUsersWithLocation);

module.exports = router;
