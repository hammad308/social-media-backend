const commentService= require("./commentService");
const {successResponse}= require("../../helpers/responseHelper");

const createComment= async(req,res)=>{
    const comment= await commentService.createComment(req.params.id,req.user._id,req.body);
    successResponse(res,201,"Comment Created Successfully",comment);
}

const getCommentsByPost = async (req,res)=>{
    const comments= await commentService.getCommentsByPost(req.params.id,req.query.cursor, req.query.limit);
    successResponse(res,200,"Comments has been Fetched Successfully",comments);
}

const deleteComment = async (req,res)=>{
    await commentService.deleteComment(req.user,req.params.commentId);
    successResponse(res,200,"Comment has been deleted Successfully");
}

module.exports= {
    createComment,
    getCommentsByPost,
    deleteComment
}