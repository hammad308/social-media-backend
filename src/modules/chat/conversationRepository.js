const Conversation = require("./conversationModel");

const findConversation = (userId1, userId2) => {
    return Conversation.findOne({
        participants: {
            $all: [userId1, userId2]
        }
    })
        .populate("participants", "username profilePicture");
};

const createConversation = async (conversationData) => {
    const conversation = await Conversation.create(conversationData);
    return Conversation.findById(conversation._id).populate("participants", "username profilePicture")
}

const getUserConversations = (userId) => {
    return Conversation.find({
        participants: userId
    })
        .populate("participants", "username profilePicture")
        .sort({ createdAt: -1 });
};

const findConversationById = (conversationId) => {
    return Conversation.findById(conversationId)
        .populate("participants", "username profilePicture");
};

const updateLastMessage = (conversationId, message) => {

    return Conversation.findByIdAndUpdate(
        conversationId,
        {
            lastMessage: message,
            lastMessageAt: new Date()
        },
        {
            returnDocument: "after"
        }
    );
};

module.exports = {
    findConversationById,
    createConversation,
    getUserConversations,
    findConversation,
    updateLastMessage
}