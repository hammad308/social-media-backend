const reactionRepository = require("./reactionRepository");
const AppError = require("../../utils/AppError");
const Post = require("../post/postModel");
const Joi = require("joi");
const notificationService = require("../notification/notificationService");
const notificationRepository = require("../notification/notificationRepository");

const reactionSchema = Joi.object({
    type: Joi.string()
        .required()
        .valid("like", "love", "haha", "wow", "sad", "angry")
        .messages({
            "any.only": "Invalid Reaction type. Please send valid reaction type",
            "any.required": "Reaction type is required."
        })
});

const reactToPost = async (postId, userId, type) => {
    const { error, value } = reactionSchema.validate(type);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError("Post not found", 404);
    }
    const existingReaction = await reactionRepository.findReaction(postId, userId);
    if (!existingReaction) {
        const reaction = await reactionRepository.createReaction({
            post: postId,
            user: userId,
            type: value.type
        });
        post.reactionsCount += 1;
        if (reaction.type === "like") {
            post.likesCount += 1;
            const notification = await notificationRepository.findNotification({
                receiver: post.author,
                sender: userId,
                type: "like",
                referenceId: post._id
            });
            if (!notification) {
                await notificationService.createNotification({
                    receiver: post.author,
                    sender: userId,
                    type: "like",
                    referenceId: post._id
                });
            }

        }
    }
    else if (existingReaction.type === value.type) {
        await reactionRepository.deleteReaction(existingReaction._id);
        post.reactionsCount -= 1;
        if (value.type === "like") {
            post.likesCount -= 1;
        }
        const notification = await notificationRepository.findNotification({
            receiver: post.author,
            sender: userId,
            type: "like",
            referenceId: post._id
        });
        if(notification){
            await notificationRepository.deleteNotification(notification._id);
        }
    } else {
        const updatedReaction = await reactionRepository.updateReaction(existingReaction._id, value.type);
        if (value.type === "like") {
            post.likesCount += 1;
            const notification = await notificationRepository.findNotification({
                receiver: post.author,
                sender: userId,
                type: "like",
                referenceId: post._id
            });
            if (!notification) {
                await notificationService.createNotification({
                    receiver: post.author,
                    sender: userId,
                    type: "like",
                    referenceId: post._id
                });
            }
        }
        else if (existingReaction.type === "like") {
            post.likesCount -= 1;
        }
    }
    await post.save();
    return post;
}

const getReactionsByPost = async (postId) => {
    return reactionRepository.getReactionsByPost(postId);
}

const checkUserReactionToPost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError("Post not found", 404);
    }
    let hasLiked = await reactionRepository.findReaction(postId, userId);
    if (!hasLiked) {
        hasLiked = false;
        return hasLiked;
    }
    hasLiked = true;
    return hasLiked;
}
module.exports = {
    reactToPost,
    getReactionsByPost,
    checkUserReactionToPost
}