const { Server } = require("socket.io");
const { Message, Conversation } = require("../models/message");
const { User } = require("../models/user");
const {
  sendPushNotificationOfChat,
} = require("../utilities/createPushNotification");

module.exports = function (app, httpServer) {
  const io = new Server(httpServer);
  // app.set("socketio", io);
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("join-conversation", (room, cb) => {
      socket.join(room);
      cb("success");
      console.log(`success in joining ${room}`);
    });

    socket.on("leave-conversation", (room) => {
      socket.leave(room);
      console.log(`success in leaving ${room}`);
    });

    socket.on("send-message", (message, conversationId, user, cb) => {
      const newMessage = new Message({
        conversationId: conversationId,
        createdAt: Date.now(),
        message: message,
        createdBy: JSON.parse(user),
      });
      socket.broadcast.to(conversationId).emit('recieve-message', newMessage)
      cb(newMessage)
      updateConversation(conversationId, newMessage, user)
    });

    socket.on("sender-typing", (isTyping, conversationId) => {
      console.log({isTyping})
      socket.broadcast.to(conversationId).emit('typing', isTyping)
    })
  });
};

async function updateConversation(conversationId, message, createrUser) {
  const senderUser = JSON.parse(createrUser)
  const conversation = await Conversation.findById(conversationId);
  const targetUserId =
    conversation.userId1 === senderUser._id
      ? conversation.userId2
      : conversation.userId1;
  const user = await User.findById(targetUserId).select("-password");

  targetUserId === conversation.userId1
    ? (conversation.user1Data = user)
    : (conversation.user2Data = user);

  conversation.unreadBy = [targetUserId];
  conversation.updatedAt = Date.now();
  conversation.recentMessage = message;
  await conversation.save();
  await message.save();

  sendPushNotificationOfChat(
    user.expoPushToken,
    senderUser.name,
    message.message,
    { data: conversation }
  );
}
