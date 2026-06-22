const Notification = require("./notificationModel");

const createNotification = (notificationData) => {
    return Notification.create(notificationData);
}

const findNotificationsByUser = (skip, limit, userId) => {
    return Notification.find({
        receiver: userId,
    })
        .populate("sender", "username profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
}

const markNotificationAsRead = (notificationId, userId) => {

    return Notification.findOneAndUpdate({
        _id: notificationId,
        receiver: userId
    },
        {
            isRead: true
        },
        {
            returnDocument: "after"
        });
}

const deleteNotification = (notificationId) => {
    return Notification.findByIdAndDelete(notificationId);
}

const markAllNotificationsAsRead = (userId) => {
    return Notification.updateMany({
        receiver: userId,
        isRead: false
    },
        {
            isRead: true
        });
}

const findNotification = (notificationData) => {
    return Notification.findOne(notificationData);
}
module.exports = {
    createNotification,
    findNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    findNotification,
    deleteNotification
}