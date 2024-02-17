import express from "express";
import multer from "multer";
import path from "path";
import { isAuthenticated } from "../utils/auth.js";
import { getAllUsers, login, logout, register } from "../controllers/user.js";

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

router.post("/register", upload.single("image"), register);

router.post("/login", login);

router.get("/get-all-users", isAuthenticated, getAllUsers);

router.get("/isAuthenticated", isAuthenticated, async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get("/logout", logout);

export default router;
