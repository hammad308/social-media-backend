const conversationController= require("./conversationController");
const protect= require("../../middleware/authMiddleware");

const express= require("express");
const router= express.Router();

router.post("/:userId",protect,conversationController.getOrCreateConversation);

router.get("/",protect,conversationController.getMyConversations);

module.exports= router;