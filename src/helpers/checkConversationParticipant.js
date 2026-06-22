const AppError = require("../utils/AppError");
const checkConversationParticipant = (conversation, senderId) => {
    console.log(conversation.participants[0]._id.toString());
    for (let participant of conversation.participants) {
        if (participant._id.toString() === senderId.toString()) {
            return;
        }
    }
    throw new AppError("Unauthorized", 403);
}

module.exports = checkConversationParticipant;