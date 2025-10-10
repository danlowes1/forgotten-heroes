const nodemailer = require("nodemailer");
require("dotenv").config();

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Test email",
      text: "Hello world",
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("Nodemailer test failed:", err);
  }
})();
// To run this test, use: node testMail.js