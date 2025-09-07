const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { isLoggedIn } = require('../middleware/auth');
const viewController = require('../controllers/view.controller');
const upload = require('../middleware/upload');
const { isSelf } = require('../middleware/isSelf');

router.put('/settings', isLoggedIn, upload.single('profileImage'), viewController.updateSettings);
router.post('/', userController.createUser);
router.get('/', isLoggedIn, userController.getUsers);
router.put('/change-password', isLoggedIn, userController.changePassword);
router.get('/:id', isLoggedIn, userController.getUserById);
router.put('/:id', isLoggedIn, userController.updateUser);
router.delete('/:id', isLoggedIn, isSelf, userController.deleteUser);
router.post('/:id/follow', isLoggedIn, userController.toggleFollow);
router.get('/search', isLoggedIn, userController.searchUsers);

module.exports = router;
