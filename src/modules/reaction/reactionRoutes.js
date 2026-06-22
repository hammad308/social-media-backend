const reactionController= require("./reactionController");
const protect=require("../../middleware/authMiddleware");
const express= require("express");

const router= express.Router();

router.get("/posts/:id/reactions",reactionController.getReactionsByPost);

router.post("/posts/:id/reactions",protect,reactionController.reactToPost);

router.get("/posts/:id/my-reaction",protect,reactionController.checkUserReactionToPost)

module.exports= router;