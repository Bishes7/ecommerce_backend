import asyncHandler from "../middleware/asyncHandler.js";
import Message from "../model/messageSchema.js";

// create message controller
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const newMessage = await Message.create({ name, email, message });
  if (newMessage) {
    res.status(200).json(newMessage);
  } else {
    res.status(200).json("Error sending message");
  }
});

// get message controller
export const getMessage = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

// delete message controller
export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  await message.deleteOne();
  res.status(200).json({ message: "Message successfully deleted" });
});
