const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { isLoggedIn } = require('../middleware/auth');


router.post('/', isLoggedIn, groupController.createGroup);
router.get('/', isLoggedIn, groupController.getGroups);
router.get('/search', isLoggedIn, groupController.searchGroups);
router.get('/:id', isLoggedIn, groupController.getGroupById);
router.get('/:id/members', isLoggedIn, groupController.getGroupMembers);
router.put('/:id', isLoggedIn, groupController.updateGroup);
router.delete('/:id', isLoggedIn, groupController.deleteGroup);
router.post('/:id/join', isLoggedIn, groupController.joinGroup);
router.post('/:id/leave', isLoggedIn, groupController.leaveGroup);
router.patch('/:id/change-admin', isLoggedIn, groupController.changeGroupAdmin);


module.exports = router;
