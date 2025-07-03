const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.post('/', notificationController.createNotification);
router.get('/', notificationController.getNotifications);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/', notificationController.clearNotifications);

module.exports = router;
