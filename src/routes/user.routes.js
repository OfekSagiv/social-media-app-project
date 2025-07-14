const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isLoggedIn } = require('../middleware/auth');
const viewController = require('../controllers/view.controller');
const upload = require('../middleware/upload');

router.put('/settings', isLoggedIn, upload.single('profileImage'), viewController.updateSettings);
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.post('/:id/follow', isLoggedIn, userController.toggleFollow);
router.delete('/me', isLoggedIn, userController.deleteMyAccount); 
router.delete('/:id', userController.deleteUser); 

module.exports = router;
