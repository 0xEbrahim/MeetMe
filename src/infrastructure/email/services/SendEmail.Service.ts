import path from "path";
import ejs from "ejs";
import { inject, injectable } from "tsyringe";
import { IEmailRepository } from "../Repositories/IEmailRepository";
import { IEmail } from "../models/models";

@injectable()
class SendEmailService {
  constructor(
    @inject("EmailRepository")
    private readonly EmailRepository: IEmailRepository
  ) {}
  private async _GetEmailTemplate(name: string, data: Record<string, any>) {
    const templatePath = path.join(
      __dirname,
      `../../../views/email/${name}.ejs`
    );
    const html = await ejs.renderFile(templatePath, data);
    return html;
  }
  async exec(data: IEmail) {
    data.template = await this._GetEmailTemplate(data.template, data.info);
    await this.EmailRepository.send(data);
  }
}

export default SendEmailService;
