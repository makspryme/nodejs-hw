import nodemailer from 'nodemailer';
import 'dotenv/config';

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//   from: UKR_NET_EMAIL,
//   to: 'lexak21553@mcenb.com',
//   subject: 'Test mail',
//   html: '<strong>Test mail</strong>',
// };

// transport
//   .sendMail(email)
//   .then((res) => console.log('Mail success sended', res))
//   .catch((error) => console.log(error));

const sendEmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transport.sendMail(email);
};

export default sendEmail;
