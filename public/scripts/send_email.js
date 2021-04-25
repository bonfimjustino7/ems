const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const remetente = nodemailer.createTransport({
  host: "smtp.titan.email",
  service: "localhost",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

exports.sendMail = (emailData) => {
  return new Promise((resolve, reject) => {
    remetente.sendMail(emailData, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};
