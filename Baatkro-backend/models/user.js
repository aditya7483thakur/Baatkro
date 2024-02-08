import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  imagePath: {
    type: String,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model("User", schema);
