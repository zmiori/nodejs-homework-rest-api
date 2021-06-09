const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "http://http://localhost:3000/";
        break;
      case "production":
        this.link = "http://http://localhost:3000/";
        break;
      default:
        this.link = "http://http://localhost:3000/";
        break;
    }
  }

  #creatVerificationEmailTemplate(token, name) {
    const emailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Phonebook",
        link: this.link,
      },
    });

    const email = {
      body: {
        name,
        intro: "Welcome to Phonebook! We're very excited to have you on board.",
        action: {
          instructions: "To get started with Phonebook, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${token}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    // Generate an HTML email with the provided contents
    return emailGenerator.generate(email);
  }

  async sendVerificationEmail(token, email, name) {
    const emailBody = this.#creatVerificationEmailTemplate(token, name);
    const result = this.sender.send({
      to: email,
      subject: "Confirm your email",
      html: emailBody,
    });
    console.log(result);
  }
}

module.exports = EmailService;
