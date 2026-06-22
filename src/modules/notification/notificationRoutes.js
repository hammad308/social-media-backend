const notificationController= require("./notificationController");
const protect= require("../../middleware/authMiddleware");
const express= require("express");
const router= express.Router();

router.get("/notifications",protect,notificationController.getMyNotifications);

router.patch("/notifications/read-all",protect,notificationController.markAllNotificationsAsRead);

router.patch("/notifications/:id/read",protect,notificationController.markNotificationAsRead);

module.exports=router;