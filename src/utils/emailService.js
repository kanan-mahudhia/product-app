const nodemailer = require('nodemailer');

function doSend(email, subject, text, html_text) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailspons.com',
    port: '587',
    auth: {
      user: 'user',
      pass: 'pass'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: text,
    html: html_text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return Promise.resolve(true);
}

function sendVerifyUserEmail(fullName, email, user_token) {
  const html_text ='Hello '+ fullName +',<br /><br />' + 'Please verify your account by clicking the link: <br />http:\/\/localhost:3001\/api\/auth\/confirmation\/' + email + '\/' + user_token + '<br /><br />Thank You!<br />';
  const subject = 'Account Verification';
  const text = 'Account Verification';

  return doSend(email, subject, text, html_text);
}

module.exports = {
  sendVerifyUserEmail
};
