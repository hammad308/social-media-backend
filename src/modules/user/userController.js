const userService = require("./userService");
const postRepository= require("../post/postRepository");
const { successResponse } = require("../../helpers/responseHelper");
const { search } = require("./userRoutes");

const getProfile = async (req, res) => {
    const posts= await postRepository.getTotalPostsOfUser(req.user._id);
    const user= req.user.toObject();
    user.posts=posts;
    successResponse(res, 200, "profile Fetched Successfully", user);
}

const updateProfile = async (req, res) => {
    const updatedUser = await userService.updateProfile(req.body, req.user);
    successResponse(res, 200, "User Profile Updated Successfully", updatedUser);
}

const followUser = async (req, res) => {
    const result = await userService.followUser(req.user, req.params.id);
    successResponse(res, 200, "User followed Successfully", result);
}

const unfollowUser = async (req, res) => {
    const result = await userService.unfollowUser(req.user, req.params.id);
    successResponse(res, 200, "User unfollowed Successfully", result);
}

const getUserProfile= async(req,res)=>{
    const profile= await userService.getUserProfile(req.params.id);
    const posts= await postRepository.getTotalPostsOfUser(profile._id);
    const isFollowing= profile.followers.includes(req.user._id);
    successResponse(res,200,"Profile Fetched Successfully",{
        id:profile._id,
        username:profile.username,
        bio:profile.bio,
        profilePicture:profile.profilePicture,
        coverPicture:profile.coverPicture,
        followersCount:profile.followers.length,
        followingCount:profile.following.length,
        posts:posts,
        isFollowing
    });
}

const updateProfilePicture= async (req,res)=>{
    const profile= await userService.updateProfilePicture(req.user,req.file);
    successResponse(res,200, "Profile Picture has been uploaded successfully",profile);
};

const updateCoverPhoto=async(req,res)=>{
    const updatedProfile= await userService.updateCoverPhoto(req.user,req.file);
    successResponse(res,200,"Cover Photo has uploaded successfully",updatedProfile);
}

const searchUsers=async (req,res)=>{
    const {username} =req.query;
    const users = await userService.searchUsers(username);
    successResponse(res,200,"Users Found",users);
}
const getUserFollowers = async(req,res)=>{
    const userConnections= await userService.getUserFollowers(req.params.id);
    successResponse(res,200,"User Connections Found", userConnections);
}

const getUserFollowings = async (req,res)=>{
    const userConnections = await userService.getUserFollowings(req.params.id);
    successResponse(res,200,"User Connections Found", userConnections);
}

module.exports = {
    getProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getUserProfile,
    updateProfilePicture,
    updateCoverPhoto,
    searchUsers,
    getUserFollowers,
    getUserFollowings
}