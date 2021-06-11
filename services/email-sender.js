const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSender {
  async send(msg) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: "zoe.baletska@meta.ua",
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
      from: "zoe.baletska@meta.ua",
      ...msg,
    };
    // console.log(emailOptions);

    return await transporter
      .sendMail(emailOptions)
      .catch((err) => console.log(err));
  }
}

module.exports = CreateSender;
