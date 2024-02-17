import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import { v2 as cloudinary } from "cloudinary";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dqulk8rno/image/upload/v1708019757/image-1708019756338.png";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  let userByName = await User.findOne({ name });

  if (userByName) {
    const error = new Error("UserName already taken");
    return next(error);
  }
  if (user) {
    const error = new Error("User Already Exist");
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let imagePath = DEFAULT_IMAGE_URL;

  if (req.file) {
    imagePath = req.file.path;
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      const result = await cloudinary.uploader.upload(imagePath, options);
      imagePath = result.secure_url; // Save Cloudinary URL
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }

  user = await User.create({
    name,
    email,
    password: hashedPassword,
    imagePath,
  });

  sendCookie(user, res, "Registered Successfully");
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Invalid Email or Password");
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid Email or Password");
      return next(error);
    }
    sendCookie(user, res, `Welcome back ${user.name}`);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const users = await User.find({ email: { $ne: req.user.email } });
  res.status(200).json({
    success: true,
    users,
  });
};

export const logout = (req, res, next) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
};
