const Notification = require('../models/Notification');

const createNotification = (data) => Notification.create(data);

const getNotificationsByRecipient = (recipientId) =>
    Notification.find({ recipientId }).sort({ createdAt: -1 });

const deleteNotificationById = (id) =>
    Notification.findByIdAndDelete(id);

const deleteAllForRecipient = (recipientId) =>
    Notification.deleteMany({ recipientId });

module.exports = {
    createNotification,
    getNotificationsByRecipient,
    deleteNotificationById,
    deleteAllForRecipient,
};
