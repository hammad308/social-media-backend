const userRepository = require("./userRepository");
const AppError = require("../../utils/AppError");
const Joi = require("joi");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const notificationService = require("../notification/notificationService");
const notificationRepository = require("../notification/notificationRepository");

const updateProfileSchema = Joi.object({
    username: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(30)
        .messages({
            "string.empty": "Username is required",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username could not exceed 30 characters"
        }),
    bio: Joi.string()
        .max(150)
        .min(0)
        .messages({
            "string.max": "Bio could not exceed 150 characters"
        })

});

const updateProfile = async (data, user) => {
    const { error, value } = updateProfileSchema.validate(data);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    const updatedUser = await userRepository.updateUserById(user._id, value);
    return updatedUser;
}

const followUser = async (currentUser, targetUserId) => {
    if (targetUserId.toString() === currentUser._id.toString()) {
        throw new AppError("You cannot follow yourself", 400);
    }
    const targetUser = await userRepository.findUserById(targetUserId);
    if (!targetUser) {
        throw new AppError("User not Found", 404)
    }
    if (currentUser.following.includes(targetUserId)) {
        throw new AppError("You are already following this user", 400)
    }
    targetUser.followers.push(currentUser._id);
    currentUser.following.push(targetUser._id);
    const notification = await notificationRepository.findNotification({
        receiver: targetUserId,
        sender: currentUser._id,
        type: "follow",
        referenceId: currentUser._id
    });
    if (!notification) {
        await notificationService.createNotification({
            receiver: targetUserId,
            sender: currentUser._id,
            type: "follow",
            referenceId: currentUser._id
        })
    }
    await targetUser.save();
    await currentUser.save();
    return {
        following: currentUser.following.length,
        followers: currentUser.followers.length
    }
}

const unfollowUser = async (currentUser, targetUserId) => {

    if (currentUser._id.toString === targetUserId.toString()) {
        throw new AppError("You cannot unfollow yourself", 400);
    }
    let targetUser = await userRepository.findUserById(targetUserId);
    if (!targetUser) {
        throw new AppError("User not Found", 404)
    }
    if (!currentUser.following.includes(targetUserId)) {
        throw new AppError("You haven't follow this user. So you can't unfollow this user", 400);
    }
    const notification = await notificationRepository.findNotification({
        receiver: targetUserId,
        sender: currentUser._id,
        type: "follow",
        referenceId: currentUser._id
    });
    if (notification) {
        await notificationRepository.deleteNotification(notification._id);
    }
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());

    await currentUser.save();
    await targetUser.save();

    return {
        followers: currentUser.followers.length,
        following: currentUser.following.length
    }

}

const getUserProfile = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new AppError("User not Found", 404);
    }
    return user;
}

const updateProfilePicture = async (user, file) => {
    if (!file) {
        throw new AppError("Image is required", 400);
    }
    const result = await uploadToCloudinary(
        file.buffer,
        "profile-pictures"
    );
    return userRepository.updateProfilePicture(user._id, result.secure_url);

}
const updateCoverPhoto = async (user, file) => {
    if (!file) {
        throw new AppError("Image is required", 400);
    }
    const result = await uploadToCloudinary(
        file.buffer,
        "cover-photos"
    );
    return userRepository.updateCoverPhoto(user._id, result.secure_url);
}
const searchUsers = async (username) => {
    if (!username || username.trim().length === 0) {
        throw new AppError("Username is required", 400);
    }
    const trimmedUsername = username.trim();
    const users = await userRepository.findUsersByUsername(username);
    return users;
}
const getUserFollowers = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new AppError("User not Found", 404);
    }
    const userConnections = await userRepository.findUserFollowers(userId);
    return userConnections;
}
const getUserFollowings = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new AppError("User not Found", 404);
    }
    const userConnections = await userRepository.findUserFollowings(userId);
    return userConnections;
}

module.exports = {
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