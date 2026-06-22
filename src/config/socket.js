const { Server } = require("socket.io");
const messageService = require("../modules/chat/messageService");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
        socket.on("joinConversation",
            (conversationId) => {
                socket.join(conversationId);
                console.log(`socket ${socket.id} joined conversation ${conversationId}`);
            });
        socket.on("sendMessage", async (data) => {
            try {
                const message = await messageService.sendMessage(
                    data.conversationId,
                    data.content,
                    data.senderId
                );
                await message.populate("sender", "_id username profilePicture")
                io.to(data.conversationId).emit("receiveMessage", message);
            } catch (error) {
                socket.emit("messageError", {
                    message: error.message
                });
            }
        });
        socket.on("markSeen", async (data) => {
            try {
                await messageService.markMessagesSeen(data.conversationId, data.userId);
                io.to(data.conversationId).emait("messagesSeenUpdate", {
                    conversationId: data.conversationId,
                    seenBy: data.userId
                })
            }catch(error){
                socket.emit("messageError",{message:error.message})
            }
    })
        socket.on("leaveConversation", (conversationId) => {
            socket.leave(conversationId);
            console.log(`socket ${socket.id} leave conversation ${conversationId}`)
        });
        socket.on("disconnect", () => {
            console.log(`User disconnected:${socket.id}`)
        });
    });
};

module.exports = initializeSocket;