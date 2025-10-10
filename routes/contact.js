// routes/contact.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, comments } = req.body;

  if (!name || !email || !comments) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Forgotten Legends Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${comments}`,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
});

module.exports = router;
