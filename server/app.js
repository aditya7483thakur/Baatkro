import express from "express";
import { createServer } from "http";
import { mongoDb } from "./data/connection.js";
import { ErrorMiddleware } from "./utils/err.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { config } from "dotenv";
import handleSocketConnection from "./socket.js";

const app = express();

config({
  path: "./data/config.env",
});

mongoDb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://baatkro.vercel.app"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve uploads directory as static
app.use("/image", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hii");
});

app.use("/user", userRouter);
app.use("/", messageRouter);

const server = createServer(app);

// Pass the server to the function handling socket logic
handleSocketConnection(server);

app.use(ErrorMiddleware);

server.listen(process.env.PORT, (req, res) => {
  console.log("Server is listening...");
});
