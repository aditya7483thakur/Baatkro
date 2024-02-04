import express from "express";
import { Message } from "../models/message.js";

const router = express.Router();

router.post("/messages", async (req, res) => {
  const { sender, receiver } = req.body;

  const chats = await Message.find({
    $or: [
      { sender, receiver },
      { sender: receiver, receiver: sender }, // vice-versa
    ],
  });
  console.log(`${sender}  ${receiver}`);
  res.json({
    success: true,
    chats,
  });
});

export default router;
