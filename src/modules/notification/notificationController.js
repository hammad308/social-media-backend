const notificationService= require("./notificationService");
const {successResponse}= require("../../helpers/responseHelper");

const getMyNotifications=async (req,res) =>{
    const notifications= await notificationService.getMyNotifications(req.user._id,req.query.page,req.query.limit);
    successResponse(res,200,"All Notifications has been fetched Successfully",notifications);
    return notifications;
}

const markNotificationAsRead= async (req,res)=>{
    const updatedNotification= await notificationService.markNotificationAsRead(req.params.id,req.user._id);
    successResponse(res,200,"Notification has been marked as Read",updatedNotification);
}

const markAllNotificationsAsRead= async (req,res)=>{
    await notificationService.markAllNotificationsAsRead(req.user._id);
    successResponse(res,200,"All Notifications has been marked as Read");
}

module.exports= {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
}
