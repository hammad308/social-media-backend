const { successResponse } = require("../../helpers/responseHelper");
const reactionService = require("./reactionService");

const reactToPost=async(req,res)=>{
    const updatedPost= await reactionService.reactToPost(req.params.id,req.user._id,req.body);
    successResponse(res,200,"Reaction Processed Successfully",updatedPost);
}

const getReactionsByPost=async(req,res)=>{
    const reactions= await reactionService.getReactionsByPost(req.params.id);
    successResponse(res,200,"Reactions has been Fetched Successfully",reactions);
}
const checkUserReactionToPost=async (req,res)=>{
    const hasLiked= await reactionService.checkUserReactionToPost(req.params.id,req.user._id);
    successResponse(res,200,"Reaction check has been processed successfully",hasLiked);
}
module.exports={
    reactToPost,
    getReactionsByPost,
    checkUserReactionToPost
}