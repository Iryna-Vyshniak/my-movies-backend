const nodemailer = require('nodemailer');

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  transport.sendMail(email);
  return true;
};

module.exports = sendEmail;

/* const email = {
  from: UKR_NET_EMAIL,
  to: 'heknirepsu@gufum.com',
  subject: 'Verify email',
  html: '<p>Verify email</p>',
};
const data = {
  to: 'heknirepsu@gufum.com',
  subject: 'Verify email',
  html: '<p>Verify email</p>',
};

transport
  .sendMail(email)
  .then(() => console.log('Verify email sent'))
  .catch((err) => console.log(err.message));
 */
