import express from "express";
import { groupMessages, messages } from "../controllers/message.js";

const router = express.Router();

router.post("/messages", messages);

router.post("/group-messages", groupMessages);

export default router;
