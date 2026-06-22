const messageController= require("./messageController");
const protect= require("../../middleware/authMiddleware");
const express= require("express");
const router= express.Router();

router.get("/:id/messages",protect,messageController.getMessages);

router.post("/:id/messages",protect,messageController.sendMessage);

router.patch("/:id/seen",protect, messageController.markMessagesSeen);

module.exports= router;