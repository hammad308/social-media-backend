const messageService= require("./messageService");

const {successResponse}= require("../../helpers/responseHelper");

const sendMessage = async (req,res)=>{
    const message= await messageService.sendMessage(req.params.id,req.body.content,req.user._id);
    successResponse(res,201,"Message Sent Successfully", message);
}

const getMessages = async (req,res)=>{
    const messages= await messageService.getMessages(req.params.id,req.query.limit, req.query.cursor, req.user._id);
    successResponse(res,200,"Messages Fetched Successfully",messages);
}

const markMessagesSeen= async (req,res)=>{
    await messageService.markMessagesSeen(req.params.id,req.user._id);
    successResponse(res,200,"Messages marked as Seen");
}

module.exports= {
    getMessages,
    sendMessage,
    markMessagesSeen
}