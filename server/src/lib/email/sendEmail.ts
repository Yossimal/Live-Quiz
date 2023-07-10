import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export type EmailData = {
  subject: string;
  text: string;
  isHtml: boolean | undefined;
};

type Message = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const transporterConfig = {
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

export default function sendEmail(
  to: string,
  data: EmailData
): Promise<SMTPTransport.SentMessageInfo> {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(transporterConfig);
    const message: Message = {
      from: process.env.EMAIL_USER!,
      to,
      subject: data.subject,
    };
    if (data.isHtml) {
      message.html = data.text;
    } else {
      message.text = data.text;
    }
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}
