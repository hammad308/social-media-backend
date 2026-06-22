const postController= require("./postController");
const express= require("express");
const protect=require("../../middleware/authMiddleware");
const upload= require("../../middleware/uploadMiddleware");

const router= express.Router();

router.post("/",protect, upload.single("image"), postController.createPost);

router.get("/feed",protect,postController.getFeedPosts);

router.get("/:id",protect,postController.getPostById);

router.delete("/:id",protect, postController.deletePostById);


module.exports= router;