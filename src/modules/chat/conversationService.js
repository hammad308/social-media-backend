const conversationRepository = require("./conversationRepository");

const getOrCreateConversation = async (currentUserId, otherUserId) => {
    const existingConversation = await conversationRepository.findConversation(currentUserId, otherUserId);
    if (!existingConversation) {
        const newConversation = await conversationRepository.createConversation({
            participants: [currentUserId, otherUserId]
        })
        newConversation.participants = newConversation.participants.filter(p => p._id !== currentUserId);
        return newConversation;
    }
    existingConversation.participants = existingConversation.participants.filter(p => p._id !== currentUserId);
    return existingConversation;
}

const getMyConversations = async (userId) => {
    let conversations = await conversationRepository.getUserConversations(userId);
    conversations = conversations.map((conv) => {
        const convObj = conv.toObject();
        convObj.participants = convObj.participants.filter(p => p._id.toString() !== userId.toString());
        return convObj;
    })
    return conversations;
}

module.exports = {
    getOrCreateConversation,
    getMyConversations
}