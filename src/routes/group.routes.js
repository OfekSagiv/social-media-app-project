const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { isLoggedIn } = require('../middleware/auth');


router.post('/', groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.get('/:id/members', groupController.getGroupMembers);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.post('/:id/join', groupController.joinGroup);
router.post('/:id/leave', groupController.leaveGroup);
router.patch('/:id/change-admin', groupController.changeGroupAdmin);
router.delete('/:id', isLoggedIn, groupController.deleteGroup);


module.exports = router;
