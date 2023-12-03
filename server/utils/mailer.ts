import nodemailer from 'nodemailer'

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export default class Mailer {
  private static get transporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }
  
  public static sendMail = (mailOptions: MailOptions) => {
    return Mailer.transporter.sendMail(mailOptions)
  }
}
