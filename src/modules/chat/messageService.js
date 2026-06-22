const messageRepository = require("./messageRepository");
const AppError = require("../../utils/AppError");
const Joi = require("joi");
const conversationRepository = require("./conversationRepository");
const checkConversationParticipant = require("../../helpers/checkConversationParticipant");
const messageSchema = Joi.object({
    content: Joi.string()
        .trim()
        .required()
        .max(1000)
        .messages({
            "string.max": "Message length Should be maximum of 1000 characters",
            "string.empty": "Message Can't be empty",
            "any.required": "Message is required"
        })
})
const sendMessage = async (conversationId, Messagecontent, senderId) => {
    const { error, value } = messageSchema.validate({
        content: Messagecontent
    });
    if (error) {
        throw new AppError(error.details[0].message, 400)
    }
    const conversation = await conversationRepository.findConversationById(conversationId);
    if (!conversation) {
        throw new AppError("Conversation not Found", 404)
    }
    checkConversationParticipant(conversation, senderId);
    const message = await messageRepository.createMessage({
        conversation: conversationId,
        sender: senderId,
        content: value.content,
        seenBy: [senderId]
    });
    await conversationRepository.updateLastMessage(conversationId, value.content);
    return message;
}

const getMessages = async (conversationId, limitNumber, cursor, userId) => {
    const conversation = await conversationRepository.findConversationById(conversationId);
    if (!conversation) {
        throw new AppError("Conversation Not Found", 404);
    }
    checkConversationParticipant(conversation, userId);
    const limit = Number(limitNumber) || 10;
    const messages = await messageRepository.getMessagesByConversation(conversationId, limit, cursor);
    return messages;
}

const markMessagesSeen = async (conversationId, userId) => {
    const conversation = await conversationRepository.findConversationById(conversationId);
    if (!conversation) {
        throw new AppError("Conversation Not Found", 404);
    }
    await checkConversationParticipant(conversation, userId);
    return messageRepository.markMessagesSeen(conversationId, userId);

}

module.exports = {
    sendMessage,
    getMessages,
    markMessagesSeen
}