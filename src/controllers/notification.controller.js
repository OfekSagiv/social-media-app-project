const notificationService = require('../services/notification.service');

const createNotification = async (req, res) => {
    try {
        const notification = await notificationService.createNotification(req.body);
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const getNotifications = async (req, res) => {
    try {
        const recipientId = req.query.recipientId;
        const notifications = await notificationService.getNotificationsForUser(recipientId);
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const deleteNotification = async (req, res) => {
    try {
        await notificationService.deleteNotification(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const clearNotifications = async (req, res) => {
    try {
        const {recipientId} = req.body;
        await notificationService.clearAllNotifications(recipientId);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

module.exports = {
    createNotification,
    getNotifications,
    deleteNotification,
    clearNotifications,
};
