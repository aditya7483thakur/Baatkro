import mongoose from "mongoose";

const schema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model("Message", schema);
