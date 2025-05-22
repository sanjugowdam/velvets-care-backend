const nodemailer = require("nodemailer");
require('dotenv/config')
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  // service: process.env.MAIL_SERVICE,
  secureConnection: false,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
module.exports = transporter;
