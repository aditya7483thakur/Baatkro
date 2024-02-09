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

const app = express();

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
  console.log("User connected:", socket.id);

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

      console.log("emm");
    } else {
      console.log(connectedUsers[user]);
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
      console.log("userId ", userId);
      try {
        // Find the user by userId and update its isOnline attribute to true
        await User.findByIdAndUpdate(userId, { isOnline: true });
        // Inside your backend code where user changes occur (e.g., when a new user is added)
        io.emit("users-changed");

        console.log(`${user} is now online`);
        console.log(connectedUsers);
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
      console.log(`User disconnected: ${disconnectedUser}`);
      delete connectedUsers[disconnectedUser];
      console.log(connectedUsers);

      try {
        // Find the user by name and update their isOnline attribute to false when they disconnect
        const user = await User.findOne({ name: disconnectedUser });
        if (user) {
          user.isOnline = false;
          await user.save();
          // Inside your backend code where user changes occur (e.g., when a new user is added)
          io.emit("users-changed");

          console.log(`${disconnectedUser} is now offline`);
        } else {
          console.log(`User ${disconnectedUser} not found`);
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  });
});

app.use(ErrorMiddleware);

server.listen(4000, (req, res) => {
  console.log("Server is listening...");
});
