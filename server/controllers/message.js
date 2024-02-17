import { Message } from "../models/message.js";

export const messages = async (req, res) => {
  const { sender, receiver } = req.body;

  const chats = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender }, // vice-versa
    ],
  });
  res.json({
    success: true,
    chats,
  });
};

export const groupMessages = async (req, res) => {
  const { receiver } = req.body;

  const chats = await Message.find({
    receiver: receiver, // The receiver is the group name, e.g., "Chat with All"
  });

  res.json({
    success: true,
    chats,
  });
};
