const commentRepository = require("./commentRepository");
const Joi = require("joi");
const Post = require("../post/postModel");
const AppError = require("../../utils/AppError");
const notificationService= require("../notification/notificationService");

const commentSchema = Joi.object({
    content: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(500)
        .messages({
            "string.empty": "Comment content cannot be empty",
            "string.max": "Comment Cannot exceed 500 characters",
            "string.min":"Comment can have minimum of 1 character"
        })
});

const createComment = async (postId, author, content ) => {
    const { error, value } = commentSchema.validate(content);
    if (error) {
        throw new AppError(error.details[0].message, 400)
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError("Post Not Found", 404)
    }
    const comment = await commentRepository.createComment({
        post: postId,
        author,
        content:value.content
    });
    await notificationService.createNotification({
        receiver:post.author,
        sender:author,
        type:"comment",
        referenceId:comment._id
    });
    post.commentsCount += 1;
    await post.save();
    return commentRepository.findCommentById(comment._id);
}

const getCommentsByPost = async (postId,cursor,limitNumber) => {
    const limit= Number(limitNumber) || 10;
    const post = await Post.findById(postId);
    if (!post) {
        throw new AppError("Post Not Found", 404)
    }
    const comments=await commentRepository.findCommentsByPost(cursor,limit,postId);
    return comments;
}

const deleteComment= async (currentUser, commentId)=>{
    const comment= await commentRepository.findCommentById(commentId).populate("author");
    if(!comment){
        throw new AppError("Comment Not found", 404);
    }
    if(currentUser._id.toString() !== comment.author._id.toString() && currentUser.role!== "admin"){
        throw new AppError("You can delete your own comments",403);
    }
    await commentRepository.deleteCommentById(commentId);

    await Post.findByIdAndUpdate(comment.post,{
        $inc:{
            commentsCount:-1
        }
    });
}
module.exports={
    createComment,
    getCommentsByPost,
    deleteComment
}