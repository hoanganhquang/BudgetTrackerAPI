const nodemailer = require("nodemailer");
const path = require("path");
class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `from admin`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async send(subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: `<p style="color: blue">${this.url}</p>`,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send("Your password reset token");
  }
}

module.exports = Email;
