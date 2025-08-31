import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.get("/send-test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "yourgmail@gmail.com", // change if you want to send to another address
      subject: "Test Email from B&B Electronics",
      text: "This is a test email to verify your NodeMailer setup.",
      html: "<h2>This is a test email</h2><p>If you see this, your setup works!</p>",
    });

    res.status(200).json({ message: "Test email sent successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send test email", error: error.message });
  }
});

export default router;
