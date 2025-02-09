const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.YOUR_EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from:  process.env.YOUR_EMAIL,
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

module.exports = { sendEmail };