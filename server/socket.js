import { Server } from "socket.io";
import { Message } from "./models/message.js";
import { User } from "./models/user.js";

const handleSocketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const connectedUsers = [];

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
};

export default handleSocketConnection;
