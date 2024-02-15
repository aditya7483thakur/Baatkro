import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import multer from "multer";
import path from "path";
import { isAuthenticated } from "../utils/auth.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

//multer's function diskStorage used to store the images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    //added Date.now to distinct the image names when differenct users
    //uploads images with same name
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("image"), async (req, res, next) => {
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
  let imagePath = null;

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
  // next();
});

router.post("/login", async (req, res, next) => {
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
});

router.get("/get-all-users", isAuthenticated, async (req, res, next) => {
  const users = await User.find({ email: { $ne: req.user.email } });
  res.status(200).json({
    success: true,
    users,
  });
});

router.get("/isAuthenticated", isAuthenticated, async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get("/image", (req, res) => {});

router.get("/logout", (req, res, next) => {
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
});

export default router;
