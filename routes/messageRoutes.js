import express from "express";
import {
  createMessage,
  getMessage,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

// post message
router.post("/", createMessage);

// get message
router.get("/", getMessage);

// delete message
router.delete("/:id", deleteMessage);

export default router;
