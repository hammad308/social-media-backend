const commentController= require("./commentController");
const protect= require("../../middleware/authMiddleware");
const express= require("express");
const router= express.Router();

router.post("/posts/:id/comments",protect,commentController.createComment);

router.get("/posts/:id/comments",protect,commentController.getCommentsByPost);

router.delete("/comments/:commentId",protect,commentController.deleteComment);

module.exports = router;