const { Notification } = require("../db_config/models");
const nodemailer = require("nodemailer");
const { prepareEmail } = require("./helpers");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emil.taciyev4@gmail.com",
    pass: "iexdywftqfrpynmo",
  },
});

module.exports = {
  addNotification: (data, cb) => {
    Notification.bulkCreate(data)
      .then((res) => cb(null, res))
      .catch((err) => cb(err, null));
  },
  sendMail(to, subject, body) {
    const mail = prepareEmail(to, subject, body);
    transporter.sendMail(mail, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};