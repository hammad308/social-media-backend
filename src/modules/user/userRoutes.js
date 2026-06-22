const express = require("express");
const router = express.Router();
const upload= require("../../middleware/uploadMiddleware");

const protect = require("../../middleware/authMiddleware");
const userController = require("./userController");

// get profile
router.get("/me", protect, userController.getProfile);
// update profile
router.put("/me", protect, userController.updateProfile);
// follow user
router.post("/:id/follow",protect,userController.followUser);
// unfollow user
router.delete("/:id/follow",protect,userController.unfollowUser);
// public profile
router.get("/:id",protect,userController.getUserProfile);

router.put("/profile-picture",protect,upload.single("image"),userController.updateProfilePicture);

router.put("/cover-photo",protect,upload.single("image"),userController.updateCoverPhoto);

router.get("/search/users",protect,userController.searchUsers);

router.get("/followers/:id",protect,userController.getUserFollowers);

router.get("/following/:id",protect,userController.getUserFollowings)

module.exports = router;