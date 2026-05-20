const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  service: process.env.MAIL_SERVICE,
  auth: {
    user: "jammylay07@gmail.com",
    pass: "wwowvagialjuecmk",
  },
});

module.exports = transporter;
