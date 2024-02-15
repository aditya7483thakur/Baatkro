import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { mongoDb } from "./data/connection.js";
import { ErrorMiddleware } from "./utils/err.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Message } from "./models/message.js";
import { User } from "./models/user.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

const app = express();

config({
  path: "./data/config.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoDb();

const connectedUsers = [];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve uploads directory as static
app.use("/image", express.static(path.join(__dirname, "uploads")));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hii");
});

app.use("/user", userRouter);
app.use("/", messageRouter);

io.on("connection", (socket) => {
  socket.on("message", async ({ data, user, chatwith, senderImage }) => {
    const newMessage = await Message.create({
      data,
      sender: user,
      receiver: chatwith.name,
      senderImage,
    });

    if (chatwith.name === "Chat With All") {
      io.emit("recieve-message", {
        data,
        user,
        chatwith,
        senderImage,
      });
    } else {
      io.to(connectedUsers[chatwith.name]).emit("recieve-message", {
        data,
        user,
        chatwith,
        senderImage,
      });
      io.to(connectedUsers[user]).emit("recieve-message", {
        data,
        user,
        chatwith,
        senderImage,
      });
    }
  });

  socket.on("login", async ({ user, userId }) => {
    if (user) {
      connectedUsers[user] = socket.id;
      try {
        // Find the user by userId and update its isOnline attribute to true
        await User.findByIdAndUpdate(userId, { isOnline: true });
        // Inside your backend code where user changes occur (e.g., when a new user is added)
        io.emit("users-changed");
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  });

  socket.on("disconnect", async () => {
    // Find the user associated with the disconnecting socket and remove them
    const disconnectedUser = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (disconnectedUser) {
      delete connectedUsers[disconnectedUser];

      try {
        // Find the user by name and update their isOnline attribute to false when they disconnect
        const user = await User.findOne({ name: disconnectedUser });
        if (user) {
          user.isOnline = false;
          await user.save();
          // Inside your backend code where user changes occur (e.g., when a new user is added)
          io.emit("users-changed");
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  });
});

app.use(ErrorMiddleware);

server.listen(process.env.PORT, (req, res) => {
  console.log("Server is listening...");
});
