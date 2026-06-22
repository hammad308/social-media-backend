const conversationService= require("./conversationService");
const {successResponse} =require("../../helpers/responseHelper");

const getOrCreateConversation=async (req,res)=>{
    const conversation= await conversationService.getOrCreateConversation(req.user._id,req.params.userId);
    successResponse(res,200,"Conversation Fetched Successfully",conversation);
}

const getMyConversations= async (req,res)=>{
    const conversations= await conversationService.getMyConversations(req.user._id);
    successResponse(res,200,"Conversations Fetched Successfully",conversations);
}

module.exports={
    getOrCreateConversation,
    getMyConversations
}