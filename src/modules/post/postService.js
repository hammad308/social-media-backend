const postRepository = require("./postRepository");
const AppError = require("../../utils/AppError");
const Joi = require("joi");
const { post } = require("../auth/authRoutes");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const reactionService = require("../reaction/reactionService");

const postSchema = Joi.object({
    content: Joi.string()
        .trim()
        .max(1000)
        .messages({
            "string.max": "Post content cannot exceed 1000 characters"
        })
})

const createPost = async (postData, currentUser, file) => {
    const { error, value } = postSchema.validate(postData);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    if (!postData && !file) {
        throw new AppError("Post must contain either text or image", 400);
    }
    const { content } = value;
    let imageUrl;
    if (file) {
        const result = await uploadToCloudinary(
            file.buffer,
            "posts"
        );
        imageUrl = result.secure_url;
    }
    const post = await postRepository.createPost({
        content,
        author: currentUser._id,
        image: imageUrl
    });
    return post;
}

const getFeedPosts = async (cursor, limitNumber, userId) => {

    const limit = Number(limitNumber) || 10;

    const posts = await postRepository.findFeedPosts(cursor, limit);

    await Promise.all(
        posts.map(async (post)=>{
        post.isLikedByUser = await reactionService.checkUserReactionToPost(post._id, userId);
        })
    )
    return posts;
}

const getPostById = async (postId, currentUserId) => {
    const post = await postRepository.findPostById(postId);
    if (!post) {
        throw new AppError("Post Not Found", 404);
    }
    const alreadyViewed = post.views.some(viewId => viewId.toString() === currentUserId.toString());
    if (!alreadyViewed) {
        post.views.push(currentUserId);
        await post.save();
    }

    return post;
}

const deletePostById = async (postId, currentuser) => {
    const post = await postRepository.findPostById(postId);
    if (!post) {
        throw new AppError("Post Not Found", 404);
    }

    if (post.author._id.toString() !== currentuser._id.toString() && currentuser.role !== "admin") {
        throw new AppError("You can only Delete your own post", 403);
    }
    await postRepository.deletePostById(postId);
    return null;
}

module.exports = {
    getPostById,
    deletePostById,
    getFeedPosts,
    createPost
}