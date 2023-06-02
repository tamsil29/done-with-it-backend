const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = mongoose.Schema({
  conversationId: { type: String, required: true },
  createdBy: { type: Object, required: true },
  createdAt: { type: String, required: true },
  message: { type: String, required: true },
});

const Message = mongoose.model("Message", messageSchema);

function validateMessage(message) {
  const schema = Joi.object({
    conversationId: Joi.objectId().required(),
    message: Joi.string().min(1).required(),
  });
  return schema.validate(message);
}

const conversationSchema = mongoose.Schema({
  userId1: { type: String, required: true },
  userId2: { type: String, required: true },
  user1Data: { type: Object, required: true },
  user2Data: { type: Object, required: true },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  recentMessage: { type: Object },
  unreadBy: { type: Array, default: [] }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = { validateMessage, Message, Conversation };
