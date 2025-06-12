import nodeMailer, { Transporter } from "nodemailer";
import { IEmailRepository } from "./IEmailRepository";
import env from "../../../shared/constant/env";
import { IEmail } from "../models/models";

class EmailRepository implements IEmailRepository {
  transporter: Transporter;
  constructor() {
    this.transporter = nodeMailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  send = async ({ to, subject, template }: IEmail) => {
    const message = await this.transporter.sendMail({
      to: to,
      from: "MeetMe CO.",
      subject: subject,
      html: template,
    });
    console.log(`Email send succesfully, ID: ${message.messageId}`);
  };
}

export default EmailRepository;
