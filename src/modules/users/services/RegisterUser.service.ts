import { container, inject, injectable } from "tsyringe";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { IRegisterUser } from "../domain/models/IRegisterUser";
import { IUser } from "../domain/models/IUser";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { IResponse } from "../../../shared/types/IResponse";
import SendEmailService from "../../../infrastructure/email/services/SendEmail.Service";
import { IEmail } from "../../../infrastructure/email/models/models";
import env from "../../../shared/constant/env";

@injectable()
class RegisterUserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: IUserRepository
  ) {}

  async exec({ name, email, password }: IRegisterUser): Promise<IResponse> {
    const emailExist = await this.UserRepository.findByEmail(email);
    if (emailExist) return ApiResponse.AlreadyExist("Email already exists.");
    const user: IUser = await this.UserRepository.register({
      name,
      email,
      password,
    });
    const SendEmail = container.resolve(SendEmailService);
    const emailData: IEmail = {
      to: user.email,
      subject: "Welcome to Our App!",
      template: "welcome-email",
      info: {
        username: user.name,
        appName: "MeetMe app",
        appUrl: env.DEV_URL,
      },
    };
    await SendEmail.exec(emailData);
    return ApiResponse.Created({ user });
  }
}
export default RegisterUserService;
