const notificationRepository = require("./notificationRepository");
const AppError= require("../../utils/AppError");

const createNotification= async ({receiver,sender,type,referenceId})=>{
    if(receiver.toString() === sender.toString()){
        return null;
    }
    const notification=await notificationRepository.createNotification({
        sender,
        receiver,
        type,
        referenceId
    });
    return notification;
}


const getMyNotifications =async (userId,pageNumber,limitNumber)=>{
    const page= Number(pageNumber) || 1;
    const limit= Number(limitNumber) || 20;
    const skip= (page-1) * limit ;
    const notifications = await notificationRepository.findNotificationsByUser(skip,limit,userId);
    return notifications;
}

const markNotificationAsRead= (notificationId,userId)=>{
    const notification= notificationRepository.markNotificationAsRead(notificationId,userId);
    if(!notification){
        throw new AppError("Notification Not Found",404);
    }
    return notification;
}

const markAllNotificationsAsRead=async (userId)=>{
    return notificationRepository.markAllNotificationsAsRead(userId); 
}
module.exports= {
    createNotification,
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
}