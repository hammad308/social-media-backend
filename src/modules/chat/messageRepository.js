const Message= require("./messageModel");

const createMessage= (messageData)=>{
    return Message.create(messageData);
}

const getMessagesByConversation=(conversationId,limit,cursor)=>{
    const query= {
        conversation:conversationId
    };
    if(cursor){
        query.createdAt={
            $lt: new Date(cursor)
        }
    };

    return Message.find(query)
        .populate("sender","username profilePicture")
        .sort(
            {
                createdAt:-1
            }
        )
        .limit(limit)
};

const markMessagesSeen=(conversationId,userId)=>{
    return Message.updateMany({
        conversation:conversationId,
        seenBy:{
            $ne:userId
        },
        sender:{
            $ne:userId
        }
    },
    {
        $addToSet:{
            seenBy:userId
        }
    });
};

module.exports={
    createMessage,
    getMessagesByConversation,
    markMessagesSeen
}