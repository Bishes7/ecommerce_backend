import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email Options
  const mailOptions = {
    from: `"B&B Electronics" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  //   Send Email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
