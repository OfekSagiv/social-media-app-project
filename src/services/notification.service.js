const notificationRepository = require('../repositories/notification.repository');

const createNotification = async (data) => {
    return await notificationRepository.createNotification(data);
};

const getNotificationsForUser = async (recipientId) => {
    return notificationRepository.getNotificationsByRecipient(recipientId);
};

const deleteNotification = async (id) => {
    return notificationRepository.deleteNotificationById(id);
};

const clearAllNotifications = async (recipientId) => {
    return notificationRepository.deleteAllForRecipient(recipientId);
};

module.exports = {
    createNotification,
    getNotificationsForUser,
    deleteNotification,
    clearAllNotifications,
};
